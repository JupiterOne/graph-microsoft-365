import {
  Step,
  IntegrationStepExecutionContext,
  createDirectRelationship,
  JobState,
  Entity,
  IntegrationLogger,
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

  await intuneClient.iterateManagedApps(async (managedApp) => {
    // Ingest all assigned or line of business apps reguardless if a device has installed it or not yet
    // TODO: This should probably be broken into two steps. One to iterate
    // the managedApps and one to iterate the managedappdevicestatuses and build
    // relationships. The overhead for reading local data is very low
    const managedAppEntity = createManagedApplicationEntity(managedApp);
    await jobState.addEntity(managedAppEntity);

    await intuneClient.iterateManagedAppDeviceStatuses(
      managedApp.id as string,
      async (deviceStatus) => {
        const deviceId = deviceStatus.deviceId;
        const deviceEntity = await jobState.findEntity(deviceId as string);

        if (!deviceEntity) {
          logger.warn(
            { deviceId, deviceStatus },
            'Error creating Device -> DeviceConfiguration relationship: deviceEntity does not exist',
          );
          return;
        }

        const deviceAssignedAppKey =
          deviceStatus.id! +
          '|' +
          deviceEntity._key +
          '|' +
          managedAppEntity._key;

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
                installState: deviceStatus.installState, // Possible values are: installed, failed, notInstalled, uninstallFailed, pendingInstall, & unknown
                installStateDetail: deviceStatus.installStateDetail, // extra details on the install state. Ex: iosAppStoreUpdateFailedToInstall
                errorCode: deviceStatus.errorCode,
                installedVersion:
                  managedApp.version ?? findNewestVersion(managedApp),
              },
            }),
          );
        }
      },
    );
  });
  if (duplicateKeysCount) {
    logger.warn(
      { duplicateKeysCount },
      'Duplicate keys encountered in managed-applications step.',
    );
  }
}

type DebugParams = {
  logger: IntegrationLogger;
  args: Record<string, any>;
  msg: string;
};

function debug({ logger, args, msg }: DebugParams) {
  if (process.env.DEBUG_APPLICATIONS) {
    logger.info(args, msg);
  }
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
              logger.warn(
                {
                  relationshipKey: deviceInstalledRelationship._key,
                  deviceKey: deviceEntity._key,
                  detectedAppEntityKey: detectedAppEntity._key,
                  detectedAppId: detectedApp.id,
                  relationshipClass:
                    relationships.MULTI_DEVICE_INSTALLED_DETECTED_APPLICATION[0]
                      ._class,
                },
                'Possible duplicate deviceInstalledDetectedApp Key',
              );
            } else {
              await jobState.addRelationship(deviceInstalledRelationship);
            }
            // TODO create managed -> detected relationships
            // // If there is a managed application related to this, create a MANAGES relationship
            // let managedAppEntity;
            // if (detectedApp.displayName?.toLowerCase) {
            //   managedAppEntity = await jobState.findEntity(
            //     MANAGED_APP_KEY_PREFIX + detectedApp.displayName?.toLowerCase(),
            //   );
            // }
            // if (managedAppEntity) {
            //   const managedAppManagesDetectedAppKey = generateRelationshipKey(
            //     RelationshipClass.MANAGES,
            //     managedAppEntity,
            //     detectedAppEntity,
            //   );
            //   if (!(await jobState.hasKey(managedAppManagesDetectedAppKey))) {
            //     await jobState.addRelationship(
            //       createDirectRelationship({
            //         _class:
            //           relationships
            //             .MANAGED_APPLICATION_MANAGES_DETECTED_APPLICATION
            //             ._class,
            //         from: managedAppEntity,
            //         to: detectedAppEntity,
            //         properties: {
            //           _key: managedAppManagesDetectedAppKey,
            //         },
            //       }),
            //     );
            //   }
            // }
          }
        },
      );
    });
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
    name: 'Managed Applications',
    entities: [entities.MANAGED_APPLICATION],
    relationships: [...relationships.MULTI_DEVICE_ASSIGNED_MANAGED_APPLICATION],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: fetchManagedApplications,
  },
  {
    id: steps.FETCH_DETECTED_APPLICATIONS,
    name: 'Detected Applications',
    entities: [entities.DETECTED_APPLICATION],
    relationships: [
      ...relationships.MULTI_DEVICE_INSTALLED_DETECTED_APPLICATION,
      // relationships.MANAGED_APPLICATION_MANAGES_DETECTED_APPLICATION,
    ],
    dependsOn: [steps.FETCH_DEVICES, steps.FETCH_MANAGED_APPLICATIONS],
    executionHandler: fetchDetectedApplications,
  },
];
