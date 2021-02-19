import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { noop } from 'lodash';
import { IntegrationConfig } from '../../types';
import { steps as activeDirectorySteps } from '../active-directory';
import { relationships, entities, steps } from './constants';

export const deviceSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_DEVICE_CATEGORIES,
    name: 'Device Categories',
    entities: [entities.DEVICE_CATEGORY],
    relationships: [],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_DEVICES,
    name: 'Managed Devices',
    entities: [entities.DEVICE],
    relationships: [
      relationships.DEVICE_CATEGORY_HAS_DEVICE,
      relationships.USER_OWNS_DEVICE,
    ],
    dependsOn: [
      steps.FETCH_DEVICE_CATEGORIES,
      activeDirectorySteps.FETCH_USERS,
    ],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_DETECTED_APPLICATIONS,
    name: 'Device Detected Applications',
    entities: [entities.DETECTED_APPLICATION],
    relationships: [relationships.DEVICE_HAS_DETECTED_APPLICATION],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_DEVICE_CONFIGURATIONS,
    name: 'Device Configurations',
    entities: [entities.DEVICE_CONFIGURATION],
    relationships: [
      relationships.GROUP_ASSIGNED_DEVICE_CONFIGURATION,
      relationships.DEVICE_USES_DEVICE_CONFIGURATION,
    ],
    dependsOn: [steps.FETCH_DEVICES, activeDirectorySteps.FETCH_GROUPS],
    executionHandler: noop,
  },
];
