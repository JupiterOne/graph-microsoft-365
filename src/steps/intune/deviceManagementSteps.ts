import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';
import { noop } from 'lodash';
import { IntegrationConfig } from '../../types';
import { steps as activeDirectorySteps } from '../active-directory/constants';
import { entities, relationships, steps } from './constants';

export const deviceManagementSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: steps.FETCH_DEVICE_COMPLIANCE_SCRIPTS,
    name: 'Device Compliance Scripts',
    entities: [entities.DEVICE_COMPLIANCE_SCRIPT],
    relationships: [relationships.DEVICE_COMPLIANCE_SCRIPT_MONITORS_DEVICE],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_DEVICE_MANAGEMENT_SCRIPTS,
    name: 'Device Management Scripts',
    entities: [entities.DEVICE_MANAGEMENT_SCRIPT],
    relationships: [
      relationships.GROUP_ASSIGNED_DEVICE_MANAGEMENT_SCRIPT,
      relationships.DEVICE_MANAGEMENT_SCRIPT_MANAGES_DEVICE,
    ],
    dependsOn: [steps.FETCH_DEVICES, activeDirectorySteps.FETCH_GROUPS],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_COMPLIANCE_POLICIES,
    name: 'Device Compliance Policies',
    entities: [entities.DEVICE_COMPLIANCE_POLICY],
    relationships: [
      relationships.DEVICE_ASSIGNED_DEVICE_COMPLIANCE_POLICY,
      relationships.USER_ASSIGNED_DEVICE_COMPLIANCE_POLICY,
      relationships.GROUP_ASSIGNED_DEVICE_COMPLIANCE_POLICY,
    ],
    dependsOn: [steps.FETCH_DEVICES],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_COMPLIANCE_POLICY_ACTION,
    name: 'Device Compliance Automated Actions',
    entities: [entities.COMPLIANCE_POLICY_ACTION],
    relationships: [
      relationships.DEVICE_COMPLIANCE_POLICY_HAS_COMPLIANCE_POLICY_ACTION,
    ],
    dependsOn: [steps.FETCH_DEVICES, steps.FETCH_COMPLIANCE_POLICIES],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_ENDPOINT_SECURITY_SETTINGS,
    name: 'Endpoint Security Settings',
    entities: [entities.ENDPOINT_SECURITY_SETTING],
    relationships: [relationships.DEVICE_HAS_ENDPOINT_SECURITY_SETTING],
    dependsOn: [
      steps.FETCH_DEVICES,
      activeDirectorySteps.FETCH_GROUPS,
      activeDirectorySteps.FETCH_USERS,
    ],
    executionHandler: noop,
  },
  {
    id: steps.FETCH_NONCOMPLIANCE_FINDINGS,
    name: 'Device Noncompliance Findings',
    entities: [entities.NONCOMPLIANCE_FINDING],
    relationships: [
      relationships.DEVICE_HAS_NONCOMPLIANCE_FINDING,
      relationships.COMPLIANCE_POLICY_IDENTIFIED_NONCOMPLIANCE_FINDING,
      relationships.COMPLIANCE_SCRIPT_IDENTIFIED_NONCOMPLIANCE_FINDING,
      relationships.ENDPOINT_SECURITY_SETTING_IDENTIFIED_NONCOMPLIANCE_FINDING,
      relationships.COMPLIANCE_POLICY_ACTION_MITIGATES_NONCOMPLIANCE_FINDING,
    ],
    dependsOn: [
      steps.FETCH_DEVICES,
      steps.FETCH_COMPLIANCE_POLICIES,
      steps.FETCH_COMPLIANCE_POLICY_ACTION,
      steps.FETCH_DEVICE_COMPLIANCE_SCRIPTS,
      steps.FETCH_ENDPOINT_SECURITY_SETTINGS,
    ],
    executionHandler: noop,
  },
];
