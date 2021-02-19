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
} from '../active-directory/constants';
import {
  STEP_DEVICE_COMPLIANCE_SCRIPTS,
  DEVICE_COMPLIANCE_SCRIPT_ENTITY_TYPE,
  DEVICE_COMPLIANCE_SCRIPT_ENTITY_CLASS,
  DEVICE_ENTITY_TYPE,
  STEP_DEVICES,
  DEVICE_MANAGEMENT_SCRIPT_DEVICE_RELATIONSHIP_TYPE,
  DEVICE_MANAGEMENT_SCRIPT_ENTITY_CLASS,
  DEVICE_MANAGEMENT_SCRIPT_ENTITY_TYPE,
  STEP_DEVICE_MANAGEMENT_SCRIPTS,
  DEVICE_MANAGEMENT_SCRIPT_GROUP_RELATIONSHIP_TYPE,
  COMPLIANCE_ACTION_ITEMS_ENTITY_CLASS,
  COMPLIANCE_ACTION_ITEMS_ENTITY_TYPE,
  COMPLIANCE_POLICIES_ENTITY_CLASS,
  COMPLIANCE_POLICIES_ENTITY_TYPE,
  COMPLIANCE_POLICY_COMPLIANCE_ACTION_ITEM_RELATIONSHIP_TYPE,
  DEVICE_COMPLIANCE_POLICY_RELATIONSHIP_TYPE,
  STEP_COMPLIANCE_ACTION_ITEMS,
  STEP_COMPLIANCE_POLICIES,
  DEVICE_COMPLIANCE_SCRIPT_DEVICE_RELATIONSHIP_TYPE,
  GROUP_COMPLIANCE_POLICY_RELATIONSHIP_TYPE,
  USER_COMPLIANCE_POLICY_RELATIONSHIP_TYPE,
  DEVICE_ENDPOINT_SECURITY_SETTING_RELATIONSHIP_TYPE,
  ENDPOINT_SECURITY_SETTING_ENTITY_CLASS,
  ENDPOINT_SECURITY_SETTING_ENTITY_TYPE,
  STEP_ENDPOINT_SECURITY_SETTINGS,
  COMPLIANCE_ACTION_ITEM_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
  COMPLIANCE_POLICY_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
  DEVICE_COMPLIANCE_SCRIPT_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
  DEVICE_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
  ENDPOINT_SECURITY_SETTING_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
  NONCOMPLIANCE_FINDING_ENTITY_CLASS,
  NONCOMPLIANCE_FINDING_ENTITY_TYPE,
  STEP_NONCOMPLIANCE_FINDINGS,
} from './constants';

export const deviceManagementSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: STEP_DEVICE_COMPLIANCE_SCRIPTS,
    name: 'Device Compliance Scripts',
    entities: [
      {
        resourceName: 'Device Compliance Script',
        _type: DEVICE_COMPLIANCE_SCRIPT_ENTITY_TYPE,
        _class: DEVICE_COMPLIANCE_SCRIPT_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: DEVICE_COMPLIANCE_SCRIPT_DEVICE_RELATIONSHIP_TYPE,
        sourceType: DEVICE_COMPLIANCE_SCRIPT_ENTITY_TYPE,
        _class: RelationshipClass.MONITORS,
        targetType: DEVICE_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICES],
    executionHandler: noop,
  },
  {
    id: STEP_DEVICE_MANAGEMENT_SCRIPTS,
    name: 'Device Management Scripts',
    entities: [
      {
        resourceName: 'Device Management Script',
        _type: DEVICE_MANAGEMENT_SCRIPT_ENTITY_TYPE,
        _class: DEVICE_MANAGEMENT_SCRIPT_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: DEVICE_MANAGEMENT_SCRIPT_GROUP_RELATIONSHIP_TYPE,
        sourceType: GROUP_ENTITY_TYPE,
        _class: RelationshipClass.ASSIGNED,
        targetType: DEVICE_MANAGEMENT_SCRIPT_ENTITY_TYPE,
      },
      {
        _type: DEVICE_MANAGEMENT_SCRIPT_DEVICE_RELATIONSHIP_TYPE,
        sourceType: DEVICE_MANAGEMENT_SCRIPT_ENTITY_TYPE,
        _class: RelationshipClass.MANAGES,
        targetType: DEVICE_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICES, STEP_GROUPS],
    executionHandler: noop,
  },
  {
    id: STEP_COMPLIANCE_POLICIES,
    name: 'Device Compliance Policies',
    entities: [
      {
        resourceName: 'Device Compliance Policy',
        _type: COMPLIANCE_POLICIES_ENTITY_TYPE,
        _class: COMPLIANCE_POLICIES_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: DEVICE_COMPLIANCE_POLICY_RELATIONSHIP_TYPE,
        sourceType: DEVICE_ENTITY_TYPE,
        _class: RelationshipClass.ASSIGNED,
        targetType: COMPLIANCE_POLICIES_ENTITY_TYPE,
      },
      {
        _type: USER_COMPLIANCE_POLICY_RELATIONSHIP_TYPE,
        sourceType: USER_ENTITY_TYPE,
        _class: RelationshipClass.ASSIGNED,
        targetType: COMPLIANCE_POLICIES_ENTITY_TYPE,
      },
      {
        _type: GROUP_COMPLIANCE_POLICY_RELATIONSHIP_TYPE,
        sourceType: GROUP_ENTITY_TYPE,
        _class: RelationshipClass.ASSIGNED,
        targetType: COMPLIANCE_POLICIES_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICES],
    executionHandler: noop,
  },
  {
    id: STEP_COMPLIANCE_ACTION_ITEMS,
    name: 'Device Compliance Automated Actions',
    entities: [
      {
        resourceName: 'Device Compliance Action',
        _type: COMPLIANCE_ACTION_ITEMS_ENTITY_TYPE,
        _class: COMPLIANCE_ACTION_ITEMS_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: COMPLIANCE_POLICY_COMPLIANCE_ACTION_ITEM_RELATIONSHIP_TYPE,
        sourceType: COMPLIANCE_POLICIES_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: COMPLIANCE_ACTION_ITEMS_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICES, STEP_COMPLIANCE_POLICIES],
    executionHandler: noop,
  },
  {
    id: STEP_ENDPOINT_SECURITY_SETTINGS,
    name: 'Endpoint Security Settings',
    entities: [
      {
        resourceName: 'Endpoint Security Setting',
        _type: ENDPOINT_SECURITY_SETTING_ENTITY_TYPE,
        _class: ENDPOINT_SECURITY_SETTING_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: DEVICE_ENDPOINT_SECURITY_SETTING_RELATIONSHIP_TYPE,
        sourceType: DEVICE_ENTITY_TYPE,
        _class: RelationshipClass.ASSIGNED,
        targetType: ENDPOINT_SECURITY_SETTING_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_DEVICES, STEP_GROUPS, STEP_USERS],
    executionHandler: noop,
  },
  {
    id: STEP_NONCOMPLIANCE_FINDINGS,
    name: 'Device Noncompliance Findings',
    entities: [
      {
        resourceName: 'Noncompliance Finding',
        _type: NONCOMPLIANCE_FINDING_ENTITY_TYPE,
        _class: NONCOMPLIANCE_FINDING_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: DEVICE_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
        sourceType: DEVICE_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: NONCOMPLIANCE_FINDING_ENTITY_TYPE,
      },
      {
        _type: COMPLIANCE_POLICY_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
        sourceType: COMPLIANCE_POLICIES_ENTITY_TYPE,
        _class: RelationshipClass.IDENTIFIED,
        targetType: NONCOMPLIANCE_FINDING_ENTITY_TYPE,
      },
      {
        _type: DEVICE_COMPLIANCE_SCRIPT_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
        sourceType: DEVICE_COMPLIANCE_SCRIPT_ENTITY_TYPE,
        _class: RelationshipClass.IDENTIFIED,
        targetType: NONCOMPLIANCE_FINDING_ENTITY_TYPE,
      },
      {
        _type: ENDPOINT_SECURITY_SETTING_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
        sourceType: ENDPOINT_SECURITY_SETTING_ENTITY_TYPE,
        _class: RelationshipClass.IDENTIFIED,
        targetType: NONCOMPLIANCE_FINDING_ENTITY_TYPE,
      },
      {
        _type: COMPLIANCE_ACTION_ITEM_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE,
        sourceType: COMPLIANCE_ACTION_ITEMS_ENTITY_TYPE,
        _class: RelationshipClass.MITIGATES,
        targetType: NONCOMPLIANCE_FINDING_ENTITY_TYPE,
      },
    ],
    dependsOn: [
      STEP_DEVICES,
      STEP_COMPLIANCE_POLICIES,
      STEP_COMPLIANCE_ACTION_ITEMS,
      STEP_DEVICE_COMPLIANCE_SCRIPTS,
      STEP_ENDPOINT_SECURITY_SETTINGS,
    ],
    executionHandler: noop,
  },
];
