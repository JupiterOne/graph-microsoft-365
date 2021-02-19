import {
  IntegrationStepExecutionContext,
  RelationshipClass,
  Step,
} from '@jupiterone/integration-sdk-core';
import { noop } from 'lodash';
import { IntegrationConfig } from '../../types';
import {
  GROUP_ENTITY_TYPE,
  STEP_GROUPS,
  STEP_USERS,
  USER_ENTITY_TYPE,
} from '../active-directory';
import {
  STEP_DEVICES,
  DEVICE_ENTITY_CLASS,
  DEVICE_ENTITY_TYPE,
  STEP_DEVICE_CATEGORIES,
  DEVICE_CATEGORY_ENTITY_TYPE,
  DEVICE_CATEGORY_ENTITY_CLASS,
  DEVICE_CATEGORY_DEVICE_RELATIONSHIP_TYPE,
  STEP_DEVICE_CONFIGURATIONS,
  DEVICE_DEVICE_CONFIGURATION_RELATIONSHIP_TYPE,
  DEVICE_CONFIGURATION_ENTITY_CLASS,
  DEVICE_CONFIGURATION_ENTITY_TYPE,
  USER_DEVICE_RELATIONSHIP_TYPE,
  GROUP_DEVICE_CONFIGURATION_RELATIONSHIP_TYPE,
  DETECTED_APPLICATION_ENTITY_CLASS,
  DETECTED_APPLICATION_ENTITY_TYPE,
  DEVICE_DETECTED_APPLICATION_RELATIONSHIP_TYPE,
  STEP_DETECTED_APPLICATIONS,
} from './constants';

export const deviceSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: STEP_DEVICE_CATEGORIES,
    name: 'Device Categories',
    entities: [
      {
        resourceName: 'Managed Device Categories',
        _type: DEVICE_CATEGORY_ENTITY_TYPE,
        _class: DEVICE_CATEGORY_ENTITY_CLASS,
      },
    ],
    relationships: [],
    executionHandler: noop,
  },
  {
    id: STEP_DEVICES,
    name: 'Managed Devices',
    entities: [
      {
        resourceName: 'Managed Device',
        _type: DEVICE_ENTITY_TYPE,
        _class: DEVICE_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: DEVICE_CATEGORY_DEVICE_RELATIONSHIP_TYPE,
        sourceType: DEVICE_CATEGORY_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: DEVICE_ENTITY_TYPE,
      },
      {
        _type: USER_DEVICE_RELATIONSHIP_TYPE,
        sourceType: USER_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: DEVICE_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICE_CATEGORIES, STEP_USERS],
    executionHandler: noop,
  },
  {
    id: STEP_DETECTED_APPLICATIONS,
    name: 'Device Detected Applications',
    entities: [
      {
        resourceName: 'Device Detected Application',
        _type: DETECTED_APPLICATION_ENTITY_TYPE,
        _class: DETECTED_APPLICATION_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: DEVICE_DETECTED_APPLICATION_RELATIONSHIP_TYPE,
        sourceType: DEVICE_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: DETECTED_APPLICATION_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICES],
    executionHandler: noop,
  },
  {
    id: STEP_DEVICE_CONFIGURATIONS,
    name: 'Device Configurations',
    entities: [
      {
        resourceName: 'Device Configuration',
        _type: DEVICE_CONFIGURATION_ENTITY_TYPE,
        _class: DEVICE_CONFIGURATION_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: GROUP_DEVICE_CONFIGURATION_RELATIONSHIP_TYPE,
        sourceType: GROUP_ENTITY_TYPE,
        _class: RelationshipClass.ASSIGNED,
        targetType: DEVICE_CONFIGURATION_ENTITY_TYPE,
      },
      {
        _type: DEVICE_DEVICE_CONFIGURATION_RELATIONSHIP_TYPE,
        sourceType: DEVICE_ENTITY_TYPE,
        _class: RelationshipClass.USES,
        targetType: DEVICE_CONFIGURATION_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICES, STEP_GROUPS],
    executionHandler: noop,
  },
];
