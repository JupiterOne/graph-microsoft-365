import {
  Step,
  IntegrationStepExecutionContext,
  createMappedRelationship,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../../types';
import {
  entities,
  managedDeviceTypes,
  relationships,
  steps,
} from '../../constants';
import {
  findNewestVersion,
  mapDetectedApplicationEntityValues,
  mapManagedApplicationEntityValues,
} from './converters';
import { DeviceManagementIntuneClient } from '../../clients/deviceManagementIntuneClient';
import { DetectedApp, ManagedApp } from '@microsoft/microsoft-graph-types-beta';

export async function fetchManagedApplications(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );
  await intuneClient.iterateManagedApps(async (managedApp) => {
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

        await jobState.addRelationship(
          createMappedRelationship({
            _key: createManagedAppMappedRelationshipKey(
              deviceEntity._key,
              managedApp,
            ),
            _class:
              relationships.MULTI_DEVICE_ASSIGNED_MANAGED_APPLICATION[0]._class,
            _mapping: {
              relationshipDirection: RelationshipDirection.FORWARD,
              sourceEntityKey: deviceEntity._key,
              targetFilterKeys: [['name', '_class']],
              targetEntity: mapManagedApplicationEntityValues(managedApp),
            },
            properties: {
              installState: deviceStatus.installState, // Possible values are: installed, failed, notInstalled, uninstallFailed, pendingInstall, & unknown
              installStateDetail: deviceStatus.installStateDetail, // extra details on the install state. Ex: iosAppStoreUpdateFailedToInstall
              errorCode: deviceStatus.errorCode,
              installedVersion:
                managedApp.version ??
                findNewestVersion(managedApp) ??
                'unversioned',
            },
          }),
        );
      },
    );
  });
}

export async function fetchDetectedApplications(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const intuneClient = new DeviceManagementIntuneClient(
    logger,
    instance.config,
  );
  // Promise.all is likely ok in this case due to there only being a few device types
  await Promise.all(
    managedDeviceTypes.map(async (type) => {
      return await jobState.iterateEntities(
        { _type: type },
        async (deviceEntity) => {
          await intuneClient.iterateDetectedApps(
            deviceEntity.id as string,
            async ({ detectedApps }) => {
              for (const detectedApp of detectedApps ?? []) {
                try {
                  await jobState.addRelationship(
                    createMappedRelationship({
                      _key: createDetectedAppMappedRelationshipKey(
                        deviceEntity._key,
                        detectedApp,
                      ),
                      _class:
                        relationships.MULTI_DEVICE_HAS_DETECTED_APPLICATION[0]
                          ._class,
                      _mapping: {
                        relationshipDirection: RelationshipDirection.FORWARD,
                        sourceEntityKey: deviceEntity._key,
                        targetFilterKeys: [['name', '_class']],
                        targetEntity: mapDetectedApplicationEntityValues(
                          detectedApp,
                        ),
                      },
                      properties: {
                        installState: 'installed',
                        version: detectedApp.version ?? 'unversioned',
                      },
                    }),
                  );
                } catch (err) {
                  // This happens when there are two instances of the same version of an app installed on a single device (it surprisingly does happen)
                  if (err.code !== 'DUPLICATE_KEY_DETECTED') {
                    throw err;
                  }
                }
              }
            },
          );
        },
      );
    }),
  );
}

function createDetectedAppMappedRelationshipKey(
  deviceKey: string,
  detectedApp: DetectedApp,
): string {
  const detectedAppDeviceRelationshipKey = `${deviceKey}|${relationships.MULTI_DEVICE_HAS_DETECTED_APPLICATION[0]._class.toLowerCase()}|FORWARD:name=${
    detectedApp.displayName
  }:_class=${entities.DETECTED_APPLICATION._class}`;
  // Append the version onto the end so there can be multiple relationships for the same application
  return (
    detectedAppDeviceRelationshipKey + '|' + detectedApp.version ??
    detectedApp.id
  );
}

function createManagedAppMappedRelationshipKey(
  deviceKey: string,
  managedApp: ManagedApp,
): string {
  const managedAppDeviceRelationshipKey = `${deviceKey}|${relationships.MULTI_DEVICE_ASSIGNED_MANAGED_APPLICATION[0]._class.toLowerCase()}|FORWARD:name=${
    managedApp.displayName
  }:_class=${entities.MANAGED_APPLICATION._class}`;
  // Append the version onto the end so there can be multiple relationships for the same application
  return (
    managedAppDeviceRelationshipKey + '|' + findNewestVersion(managedApp) ??
    managedApp.id
  );
}

export const applicationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_MANAGED_APPLICATIONS,
    name: 'Managed Applications',
    entities: [], // only mapped entities are created
    relationships: [...relationships.MULTI_DEVICE_ASSIGNED_MANAGED_APPLICATION], // Relationships will be mapped, but leaving for documentation
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: fetchManagedApplications,
  },
  {
    id: steps.FETCH_DETECTED_APPLICATIONS,
    name: 'Detected Applications',
    entities: [], // only mapped entities are created
    relationships: [...relationships.MULTI_DEVICE_HAS_DETECTED_APPLICATION], // Relationships will be mapped, but leaving for documentation
    dependsOn: [steps.FETCH_DEVICES, steps.FETCH_MANAGED_APPLICATIONS],
    executionHandler: fetchDetectedApplications,
  },
];
