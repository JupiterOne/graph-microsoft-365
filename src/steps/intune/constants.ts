import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { entities as activeDirectoryEntities } from '../active-directory';

export const steps: Record<string, string> = {
  FETCH_DEVICES: 'managed-devices',
  FETCH_DETECTED_APPLICATIONS: 'detected-applications',
  FETCH_DEVICE_CATEGORIES: 'device-categories',
  FETCH_DEVICE_CONFIGURATIONS: 'device-configurations',
  FETCH_DEVICE_COMPLIANCE_SCRIPTS: 'compliance-scripts',
  FETCH_DEVICE_MANAGEMENT_SCRIPTS: 'management-scripts',
  FETCH_COMPLIANCE_POLICIES: 'compliance-policies',
  FETCH_COMPLIANCE_POLICY_ACTION: 'compliance-action-items',
  FETCH_MOBILE_APPS: 'mobile-applications',
  FETCH_ENDPOINT_SECURITY_SETTINGS: 'endpoint-security-settings',
  FETCH_NONCOMPLIANCE_FINDINGS: 'noncompliance-findings',
  FETCH_MANAGED_APPLICATIONS: 'managed-appplications',
  FETCH_APPLICATION_CATEGORIES: 'application-categories',
  FETCH_MANAGED_APPLICATION_POLICIES: 'managed-application-policies',
  FETCH_MANAGED_APPLICATION_CONFIGURATIONS:
    'managed-application-configurations',
};

export const entities: Record<string, StepEntityMetadata> = {
  DEVICE_CATEGORY: {
    resourceName: 'Managed Device Categories',
    _type: 'device_category',
    _class: 'Group',
  },
  DEVICE: {
    resourceName: 'Managed Device',
    _type: 'managed_device',
    _class: ['Host', 'Device'],
  },
  DETECTED_APPLICATION: {
    resourceName: 'Device Detected Application',
    _type: 'detected_applications',
    _class: 'Application',
  },
  DEVICE_CONFIGURATION: {
    resourceName: 'Device Configuration',
    _type: 'device_configuration',
    _class: 'Configuration',
  },
  DEVICE_COMPLIANCE_SCRIPT: {
    resourceName: 'Device Compliance Script',
    _type: 'device_compliance_script',
    _class: 'Assessment',
  },
  DEVICE_MANAGEMENT_SCRIPT: {
    resourceName: 'Device Management Script',
    _type: 'device_management_script',
    _class: 'Service',
  },
  DEVICE_COMPLIANCE_POLICY: {
    resourceName: 'Device Compliance Policy',
    _type: 'device_compliance_policy',
    _class: 'Configuration',
  },
  COMPLIANCE_POLICY_ACTION: {
    resourceName: 'Device Compliance Policy Action',
    _type: 'device_compliance_policy_action_item',
    _class: 'Rule',
  },
  ENDPOINT_SECURITY_SETTING: {
    resourceName: 'Endpoint Security Setting',
    _type: 'endpoint_security_setting',
    _class: 'Configuration',
  },
  NONCOMPLIANCE_FINDING: {
    resourceName: 'Noncompliance Finding',
    _type: 'device_statuses',
    _class: 'Finding',
  },
  MANAGED_APPLICATION: {
    resourceName: 'Managed Application',
    _type: 'managed_application',
    _class: 'Application',
  },
  APPLICATION_CATEGORY: {
    resourceName: 'Application Category',
    _type: 'application_category',
    _class: 'Group',
  },
  APPLICATION_POLICY: {
    resourceName: 'Application Policy',
    _type: 'application_policy',
    _class: 'Configuration',
  },
  APPLICATION_CONFIGURATION: {
    resourceName: 'Application Configuration',
    _type: 'application_configuration',
    _class: 'Configuration',
  },
};

export const relationships: Record<string, StepRelationshipMetadata> = {
  USER_HAS_DEVICE: {
    _type: 'user_has_device',
    sourceType: activeDirectoryEntities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: entities.DEVICE._type,
  },
  DEVICE_CATEGORY_HAS_DEVICE: {
    _type: 'device_category_has_device',
    sourceType: entities.DEVICE_CATEGORY._type,
    _class: RelationshipClass.HAS,
    targetType: entities.DEVICE._type,
  },
  DEVICE_HAS_DETECTED_APPLICATION: {
    _type: 'device_has_detected_application',
    sourceType: entities.DEVICE._type,
    _class: RelationshipClass.HAS,
    targetType: entities.DETECTED_APPLICATION._type,
  },
  GROUP_ASSIGNED_DEVICE_CONFIGURATION: {
    _type: 'microsoft_365_user_group_assigned_device_configuration',
    sourceType: activeDirectoryEntities.GROUP._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: entities.DEVICE_CONFIGURATION._type,
  },
  DEVICE_USES_DEVICE_CONFIGURATION: {
    _type: 'device_uses_device_configuration',
    sourceType: entities.DEVICE._type,
    _class: RelationshipClass.USES,
    targetType: entities.DEVICE_CONFIGURATION._type,
  },
  DEVICE_COMPLIANCE_SCRIPT_MONITORS_DEVICE: {
    _type: 'device_compliance_script_monitors_device',
    sourceType: entities.DEVICE_COMPLIANCE_SCRIPT._type,
    _class: RelationshipClass.MONITORS,
    targetType: entities.DEVICE._type,
  },
  GROUP_ASSIGNED_DEVICE_MANAGEMENT_SCRIPT: {
    _type: 'microsoft_365_user_group_assigned_device_management_script',
    sourceType: activeDirectoryEntities.GROUP._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: entities.DEVICE_MANAGEMENT_SCRIPT._type,
  },
  DEVICE_MANAGEMENT_SCRIPT_MANAGES_DEVICE: {
    _type: 'device_management_script_manages_device',
    sourceType: entities.DEVICE_MANAGEMENT_SCRIPT._type,
    _class: RelationshipClass.MANAGES,
    targetType: entities.DEVICE._type,
  },
  DEVICE_ASSIGNED_DEVICE_COMPLIANCE_POLICY: {
    _type: 'device_assigned_device_compliance_policy',
    sourceType: entities.DEVICE._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: entities.DEVICE_COMPLIANCE_POLICY._type,
  },
  USER_ASSIGNED_DEVICE_COMPLIANCE_POLICY: {
    _type: 'microsoft_365_user_assigned_device_compliance_policy',
    sourceType: activeDirectoryEntities.USER._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: entities.DEVICE_COMPLIANCE_POLICY._type,
  },
  GROUP_ASSIGNED_DEVICE_COMPLIANCE_POLICY: {
    _type: 'microsoft_365_group_assigned_device_compliance_policy',
    sourceType: activeDirectoryEntities.GROUP._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: entities.DEVICE_COMPLIANCE_POLICY._type,
  },
  DEVICE_COMPLIANCE_POLICY_HAS_COMPLIANCE_POLICY_ACTION: {
    _type: 'device_compliance_policy_has_device_compliance_policy_action_item',
    sourceType: entities.DEVICE_COMPLIANCE_POLICY._type,
    _class: RelationshipClass.HAS,
    targetType: entities.COMPLIANCE_POLICY_ACTION._type,
  },
  DEVICE_HAS_ENDPOINT_SECURITY_SETTING: {
    _type: 'device_assigned_endpoint_security_setting',
    sourceType: entities.DEVICE._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: entities.ENDPOINT_SECURITY_SETTING._type,
  },
  DEVICE_HAS_NONCOMPLIANCE_FINDING: {
    _type: 'device_has_noncompliance_finding',
    sourceType: entities.DEVICE._type,
    _class: RelationshipClass.HAS,
    targetType: entities.NONCOMPLIANCE_FINDING._type,
  },
  COMPLIANCE_POLICY_IDENTIFIED_NONCOMPLIANCE_FINDING: {
    _type: 'compliance_policy_identified_noncompliance_finding',
    sourceType: entities.DEVICE_COMPLIANCE_POLICY._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: entities.NONCOMPLIANCE_FINDING._type,
  },
  COMPLIANCE_SCRIPT_IDENTIFIED_NONCOMPLIANCE_FINDING: {
    _type: 'device_compliance_script_identifies_noncompliance_finding',
    sourceType: entities.DEVICE_COMPLIANCE_SCRIPT._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: entities.NONCOMPLIANCE_FINDING._type,
  },
  ENDPOINT_SECURITY_SETTING_IDENTIFIED_NONCOMPLIANCE_FINDING: {
    _type: 'endpoint_security_setting_identifies_noncompliance_finding',
    sourceType: entities.ENDPOINT_SECURITY_SETTING._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: entities.NONCOMPLIANCE_FINDING._type,
  },
  COMPLIANCE_POLICY_ACTION_MITIGATES_NONCOMPLIANCE_FINDING: {
    _type: 'compliance_policy_action_mitigates_noncompliance_finding',
    sourceType: entities.COMPLIANCE_POLICY_ACTION._type,
    _class: RelationshipClass.MITIGATES,
    targetType: entities.NONCOMPLIANCE_FINDING._type,
  },
  DEVICE_ASSIGNED_MANAGED_APPLICATION: {
    _type: 'device_assigned_managed_application',
    sourceType: entities.DEVICE._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: entities.MANAGED_APPLICATION._type,
  },
  MANAGED_APPLICATION_HAS_ENDPOINT_SECURITY_SETTING: {
    _type: 'managed_application_has_endpoint_security_setting',
    sourceType: entities.MANAGED_APPLICATION._type,
    _class: RelationshipClass.HAS,
    targetType: entities.ENDPOINT_SECURITY_SETTING._type,
  },
  APPLICATION_CATEGORY_HAS_MANAGED_APPLICATION: {
    _type: 'application_category_has_managed_application',
    sourceType: entities.APPLICATION_CATEGORY._type,
    _class: RelationshipClass.HAS,
    targetType: entities.MANAGED_APPLICATION._type,
  },
  MANAGED_APPLICATION_ASSIGNED_APPLICATION_POLICY: {
    _type: 'managed_application_assigned_application_policy',
    sourceType: entities.MANAGED_APPLICATION._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: entities.APPLICATION_POLICY._type,
  },
  MANAGED_APPLICATION_USES_APPLICATION_CONFIGURATION: {
    _type: 'managed_application_uses_application_configuration',
    sourceType: entities.MANAGED_APPLICATION._type,
    _class: RelationshipClass.USES,
    targetType: entities.APPLICATION_CONFIGURATION._type,
  },
  APPLICATION_CONFIGURATION_IDENTIFIES_NONCOMPLIANCE_FINDING: {
    _type: 'application_configuration_identifies_device_noncompliance_finding',
    sourceType: entities.APPLICATION_CONFIGURATION._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: entities.NONCOMPLIANCE_FINDING._type,
  },
};
