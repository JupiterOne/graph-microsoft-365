import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { noop } from 'lodash';
import { IntegrationConfig } from '../../types';
import { entities, relationships, steps } from './constants';

export const mobileManagementSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_MANAGED_APPLICATIONS,
    name: 'Managed Applications',
    entities: [entities.MANAGED_APPLICATION],
    relationships: [
      relationships.DEVICE_ASSIGNED_MANAGED_APPLICATION,
      relationships.MANAGED_APPLICATION_HAS_ENDPOINT_SECURITY_SETTING,
    ],
    dependsOn: [steps.FETCH_DEVICES, steps.FETCH_ENDPOINT_SECURITY_SETTINGS],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_APPLICATION_CATEGORIES,
    name: 'Application Categories',
    entities: [entities.APPLICATION_CATEGORY],
    relationships: [relationships.APPLICATION_CATEGORY_HAS_MANAGED_APPLICATION],
    dependsOn: [steps.FETCH_MANAGED_APPLICATIONS],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_MANAGED_APPLICATION_POLICIES,
    name: 'Application Policies',
    entities: [entities.APPLICATION_POLICY],
    relationships: [
      relationships.MANAGED_APPLICATION_ASSIGNED_APPLICATION_POLICY,
    ],
    dependsOn: [steps.FETCH_MANAGED_APPLICATIONS],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_MANAGED_APPLICATION_CONFIGURATIONS,
    name: 'Application Configurations',
    entities: [entities.APPLICATION_CONFIGURATION],
    relationships: [
      relationships.MANAGED_APPLICATION_USES_APPLICATION_CONFIGURATION,
      relationships.APPLICATION_CONFIGURATION_IDENTIFIES_NONCOMPLIANCE_FINDING,
    ],
    dependsOn: [
      steps.FETCH_MANAGED_APPLICATIONS,
      steps.FETCH_NONCOMPLIANCE_FINDINGS,
    ],
    executionHandler: noop,
  },
];
