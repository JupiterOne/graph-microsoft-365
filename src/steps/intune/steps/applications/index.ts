import {
  Step,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  JobState,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import {
  entities,
  managedDeviceTypes,
  relationships,
  steps,
} from '../../constants';
import {
  buildDetectedApplicationEntityKey,
  createDetectedApplicationEntity,
  createDeviceInstalledApplicationRelationship,
  createManagedApplicationEntity,
  findNewestVersion,
} from './converters';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { DetectedApp } from '@microsoft/microsoft-graph-types-beta';
import { IngestionSources } from '../../../constants';

export async function fetchManagedApplications({
  logger,
  instance,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );

  let duplicateKeysCount = 0;
  logger.info('Starting to fetch managed applications...');

  await intuneClient.iterateManagedApps(async (managedApp) => {
    // Ingest all assigned or line of business apps reguardless if a device has installed it or not yet
    // TODO: This should probably be broken into two steps. One to iterate
    // the managedApps and one to iterate the managedappdevicestatuses and build
    // relationships. The overhead for reading local data is very low
    const managedAppEntity = createManagedApplicationEntity(managedApp);
    await jobState.addEntity(managedAppEntity);

    try {
      await intuneClient.iterateManagedAppDeviceStatuses(
        managedApp.id as string,
        async (deviceStatus) => {
          const deviceId = deviceStatus.DeviceId;
          const deviceEntity = await jobState.findEntity(deviceId as string);

          if (!deviceEntity) {
            logger.warn(
              { deviceId, deviceStatus },
              'Error creating Device -> DeviceConfiguration relationship: deviceEntity does not exist',
            );
            return;
          }

          const deviceAssignedAppKey =
            deviceEntity._key + '|' + managedAppEntity._key;

          if (jobState.hasKey(deviceAssignedAppKey)) {
            duplicateKeysCount++;
          } else {
            await jobState.addRelationship(
              createDirectRelationship({
                _class:
                  relationships.MULTI_DEVICE_ASSIGNED_MANAGED_APPLICATION[0]
                    ._class,
                from: deviceEntity,
                to: managedAppEntity,
                properties: {
                  _key: deviceAssignedAppKey,
                  installState: deviceStatus.InstallState, // Possible values are: installed, failed, notInstalled, uninstallFailed, pendingInstall, & unknown
                  installStateDetail: deviceStatus.InstallStateDetail, // extra details on the install state. Ex: iosAppStoreUpdateFailedToInstall
                  errorCode: deviceStatus.ErrorCode,
                  installedVersion:
                    managedApp.version ?? findNewestVersion(managedApp),
                },
              }),
            );
          }
        },
      );
    } catch (err) {
      logger.warn(err, 'Error when fetching device installation reports');
    }
  });

  if (duplicateKeysCount) {
    logger.warn(
      { duplicateKeysCount },
      'Duplicate keys encountered in managed-applications step.',
    );
  }

  logger.info('Completed fetching managed applications');
}

/**
 * Creates a single `Application { _type: 'intune_detected_application' }` entity generated
 * for each `Application.displayName`. All `Device` entities which have an app installed with
 * that name will create relationships with `version` properties to this single `Application`
 * entity.
 */
export async function fetchDetectedApplications(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );

  let duplicateKeysCount = 0;
  for (const type of managedDeviceTypes) {
    await jobState.iterateEntities({ _type: type }, async (deviceEntity) => {
      const deviceEntityId = deviceEntity.id as string;

      await intuneClient.iterateDetectedApps(
        deviceEntityId,
        async ({ detectedApps }) => {
          for (const detectedApp of detectedApps ?? []) {
            // Ingest all assigned or line of business apps reguardless if a device has installed it or not yet
            const detectedAppEntity =
              await findOrCreateDetectedApplicationEntity(
                detectedApp,
                jobState,
              );

            const deviceInstalledRelationship =
              createDeviceInstalledApplicationRelationship({
                deviceEntity,
                detectedAppEntity,
                detectedApp,
              });

            if (jobState.hasKey(deviceInstalledRelationship._key)) {
              duplicateKeysCount++;
            } else {
              await jobState.addRelationship(deviceInstalledRelationship);
            }
          }
        },
      );
    });
  }
  if (duplicateKeysCount) {
    logger.warn(
      { duplicateKeysCount },
      'Duplicate keys encountered in managed-applications step.',
    );
  }
}

async function findOrCreateDetectedApplicationEntity(
  detectedApp: DetectedApp,
  jobState: JobState,
): Promise<Entity> {
  let detectedAppEntity = await jobState.findEntity(
    buildDetectedApplicationEntityKey(detectedApp),
  );

  if (!detectedAppEntity) {
    detectedAppEntity = await jobState.addEntity(
      createDetectedApplicationEntity(detectedApp),
    );
  }

  return detectedAppEntity;
}

export const applicationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_MANAGED_APPLICATIONS,
    ingestionSourceId: IngestionSources.APPLICATIONS,
    name: 'Managed Applications',
    entities: [entities.MANAGED_APPLICATION],
    relationships: [...relationships.MULTI_DEVICE_ASSIGNED_MANAGED_APPLICATION],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: fetchManagedApplications,
  },
  {
    id: steps.FETCH_DETECTED_APPLICATIONS,
    ingestionSourceId: IngestionSources.APPLICATIONS,
    name: 'Detected Applications',
    entities: [entities.DETECTED_APPLICATION],
    relationships: [
      ...relationships.MULTI_DEVICE_INSTALLED_DETECTED_APPLICATION,
    ],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: fetchDetectedApplications,
  },
];
