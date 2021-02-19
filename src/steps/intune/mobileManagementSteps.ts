import {
  IntegrationStepExecutionContext,
  RelationshipClass,
  Step,
} from '@jupiterone/integration-sdk-core';
import { noop } from 'lodash';
import { IntegrationConfig } from '../../types';
import {
  APPLICATION_CATEGORY_ENTITY_CLASS,
  APPLICATION_CATEGORY_ENTITY_TYPE,
  APPLICATION_CATEGORY_MANAGED_APPLICATION_RELATIONSHIP_TYPE,
  APPLICATION_CONFIGURATION_ENTITY_CLASS,
  APPLICATION_CONFIGURATION_ENTITY_TYPE,
  APPLICATION_CONFIGURATION_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
  APPLICATION_POLICY_ENTITY_CLASS,
  APPLICATION_POLICY_ENTITY_TYPE,
  DEVICE_ENTITY_TYPE,
  DEVICE_MANAGED_APPLICATION_RELATIONSHIP_TYPE,
  ENDPOINT_SECURITY_SETTING_ENTITY_TYPE,
  MANAGED_APPLICATION_APPLICATION_CONFIGURATION_RELATIONSHIP_TYPE,
  MANAGED_APPLICATION_APPLICATION_POLICY_RELATIONSHIP_TYPE,
  MANAGED_APPLICATION_ENDPOINT_SECURITY_SETTING_RELATIONSHIP_TYPE,
  MANAGED_APPLICATION_ENTITY_CLASS,
  MANAGED_APPLICATION_ENTITY_TYPE,
  NONCOMPLIANCE_FINDING_ENTITY_TYPE,
  STEP_APPLICATION_CATEGORIES,
  STEP_DEVICES,
  STEP_ENDPOINT_SECURITY_SETTINGS,
  STEP_MANAGED_APPLICATIONS,
  STEP_MANAGED_APPLICATION_CONFIGURATIONS,
  STEP_MANAGED_APPLICATION_POLICIES,
  STEP_NONCOMPLIANCE_FINDINGS,
} from './constants';

export const mobileManagementSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: STEP_MANAGED_APPLICATIONS,
    name: 'Managed Applications',
    entities: [
      {
        resourceName: 'Managed Application',
        _type: MANAGED_APPLICATION_ENTITY_TYPE,
        _class: MANAGED_APPLICATION_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: DEVICE_MANAGED_APPLICATION_RELATIONSHIP_TYPE,
        sourceType: DEVICE_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: MANAGED_APPLICATION_ENTITY_TYPE,
      },
      {
        _type: MANAGED_APPLICATION_ENDPOINT_SECURITY_SETTING_RELATIONSHIP_TYPE,
        sourceType: MANAGED_APPLICATION_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: ENDPOINT_SECURITY_SETTING_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICES, STEP_ENDPOINT_SECURITY_SETTINGS],
    executionHandler: noop,
  },
  {
    id: STEP_APPLICATION_CATEGORIES,
    name: 'Application Categories',
    entities: [
      {
        resourceName: 'Application Category',
        _type: APPLICATION_CATEGORY_ENTITY_TYPE,
        _class: APPLICATION_CATEGORY_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: APPLICATION_CATEGORY_MANAGED_APPLICATION_RELATIONSHIP_TYPE,
        sourceType: APPLICATION_CATEGORY_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: MANAGED_APPLICATION_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_MANAGED_APPLICATIONS],
    executionHandler: noop,
  },
  {
    id: STEP_MANAGED_APPLICATION_POLICIES,
    name: 'Application Policies',
    entities: [
      {
        resourceName: 'Application Policy',
        _type: APPLICATION_POLICY_ENTITY_TYPE,
        _class: APPLICATION_POLICY_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: MANAGED_APPLICATION_APPLICATION_POLICY_RELATIONSHIP_TYPE,
        sourceType: MANAGED_APPLICATION_ENTITY_TYPE,
        _class: RelationshipClass.ASSIGNED,
        targetType: APPLICATION_POLICY_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_MANAGED_APPLICATIONS],
    executionHandler: noop,
  },
  {
    id: STEP_MANAGED_APPLICATION_CONFIGURATIONS,
    name: 'Application Configurations',
    entities: [
      {
        resourceName: 'Application Configuration',
        _type: APPLICATION_CONFIGURATION_ENTITY_TYPE,
        _class: APPLICATION_CONFIGURATION_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: MANAGED_APPLICATION_APPLICATION_CONFIGURATION_RELATIONSHIP_TYPE,
        sourceType: MANAGED_APPLICATION_ENTITY_TYPE,
        _class: RelationshipClass.USES,
        targetType: APPLICATION_CONFIGURATION_ENTITY_TYPE,
      },
      {
        _type: APPLICATION_CONFIGURATION_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
        sourceType: APPLICATION_CONFIGURATION_ENTITY_TYPE,
        _class: RelationshipClass.IDENTIFIED,
        targetType: NONCOMPLIANCE_FINDING_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_MANAGED_APPLICATIONS, STEP_NONCOMPLIANCE_FINDINGS],
    executionHandler: noop,
  },
];
