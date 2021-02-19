export const STEP_DEVICES = 'managed-devices';
export const STEP_DETECTED_APPLICATIONS = 'detected-applications';
export const STEP_DEVICE_CATEGORIES = 'device-categories';
export const STEP_DEVICE_CONFIGURATIONS = 'device-configurations';
export const STEP_DEVICE_COMPLIANCE_SCRIPTS = 'compliance-scripts';
export const STEP_DEVICE_MANAGEMENT_SCRIPTS = 'management-scripts';
export const STEP_COMPLIANCE_POLICIES = 'compliance-policies';
export const STEP_COMPLIANCE_ACTION_ITEMS = 'compliance-action-items';
export const STEP_MOBILE_APPS = 'mobile-applications';
export const STEP_ENDPOINT_SECURITY_SETTINGS = 'endpoint-security-settings';
export const STEP_NONCOMPLIANCE_FINDINGS = 'noncompliance-findings';
export const STEP_MANAGED_APPLICATIONS = 'managed-appplications';
export const STEP_APPLICATION_CATEGORIES = 'application-categories';
export const STEP_MANAGED_APPLICATION_POLICIES = 'managed-application-policies';
export const STEP_MANAGED_APPLICATION_CONFIGURATIONS =
  'managed-application-configurations';

export const DEVICE_ENTITY_TYPE = 'managed_device';
export const DEVICE_ENTITY_CLASS = ['Host', 'Device'];

export const DETECTED_APPLICATION_ENTITY_TYPE = 'detected_apps';
export const DETECTED_APPLICATION_ENTITY_CLASS = 'Application';

export const DEVICE_CATEGORY_ENTITY_TYPE = 'device_category';
export const DEVICE_CATEGORY_ENTITY_CLASS = 'Group';

export const DEVICE_CONFIGURATION_ENTITY_TYPE = 'device_configuration';
export const DEVICE_CONFIGURATION_ENTITY_CLASS = 'Configuration';

export const DEVICE_COMPLIANCE_SCRIPT_ENTITY_TYPE = 'device_compliance_script';
export const DEVICE_COMPLIANCE_SCRIPT_ENTITY_CLASS = 'Assessment';

export const DEVICE_MANAGEMENT_SCRIPT_ENTITY_TYPE = 'device_management_script';
export const DEVICE_MANAGEMENT_SCRIPT_ENTITY_CLASS = 'Service';

export const COMPLIANCE_POLICIES_ENTITY_TYPE = 'device_compliance_policy';
export const COMPLIANCE_POLICIES_ENTITY_CLASS = 'Configuration';

export const COMPLIANCE_ACTION_ITEMS_ENTITY_TYPE =
  'device_compliance_action_item';
export const COMPLIANCE_ACTION_ITEMS_ENTITY_CLASS = 'Rule';

export const MOBILE_APP_ENTITY_TYPE = 'mobile_app';
export const MOBILE_APP_ENTITY_CLASS = 'Application';

export const ENDPOINT_SECURITY_SETTING_ENTITY_TYPE =
  'endpoint_security_setting';
export const ENDPOINT_SECURITY_SETTING_ENTITY_CLASS = 'Configuration';

export const NONCOMPLIANCE_FINDING_ENTITY_TYPE = 'device_statuses';
export const NONCOMPLIANCE_FINDING_ENTITY_CLASS = 'Finding';

export const MANAGED_APPLICATION_ENTITY_TYPE = 'managed_application';
export const MANAGED_APPLICATION_ENTITY_CLASS = 'Application';

export const APPLICATION_CATEGORY_ENTITY_TYPE = 'application_category';
export const APPLICATION_CATEGORY_ENTITY_CLASS = 'Group';

export const APPLICATION_POLICY_ENTITY_TYPE = 'application_policy';
export const APPLICATION_POLICY_ENTITY_CLASS = 'Configuration';

export const APPLICATION_CONFIGURATION_ENTITY_TYPE =
  'application_configuration';
export const APPLICATION_CONFIGURATION_ENTITY_CLASS = 'Configuration';

export const USER_DEVICE_RELATIONSHIP_TYPE = 'user_owns_device';
export const DEVICE_DETECTED_APPLICATION_RELATIONSHIP_TYPE =
  'device_has_detected_application';
export const DEVICE_CATEGORY_DEVICE_RELATIONSHIP_TYPE =
  'device_category_has_device';
export const GROUP_DEVICE_CONFIGURATION_RELATIONSHIP_TYPE =
  'microsoft_365_user_group_assigned_device_configuration';
export const DEVICE_DEVICE_CONFIGURATION_RELATIONSHIP_TYPE =
  'device_uses_device_configuration';
export const DEVICE_COMPLIANCE_SCRIPT_DEVICE_RELATIONSHIP_TYPE =
  'device_compliance_script_monitors_device';
export const DEVICE_MANAGEMENT_SCRIPT_GROUP_RELATIONSHIP_TYPE =
  'microsoft_365_user_group_assigned_device_management_script';
export const DEVICE_MANAGEMENT_SCRIPT_DEVICE_RELATIONSHIP_TYPE =
  'device_management_script_manages_device';
export const DEVICE_COMPLIANCE_POLICY_RELATIONSHIP_TYPE =
  'device_assigned_device_compliance_script';
export const USER_COMPLIANCE_POLICY_RELATIONSHIP_TYPE =
  'user_assigned_device_compliance_script';
export const GROUP_COMPLIANCE_POLICY_RELATIONSHIP_TYPE =
  'group_assigned_device_compliance_script';
export const COMPLIANCE_POLICY_COMPLIANCE_ACTION_ITEM_RELATIONSHIP_TYPE =
  'device_compliance_policy_has_device_compliance_action_item';
export const DEVICE_MOBILE_APP_RELATIONSHIP_TYPE = 'device_has_mobile_app';
export const DEVICE_ENDPOINT_SECURITY_SETTING_RELATIONSHIP_TYPE =
  'device_assigned_endpoint_security_setting';
export const USER_ENDPOINT_SECURITY_SETTING_RELATIONSHIP_TYPE =
  'user_assigned_endpoint_security_setting';
export const GROUP_ENDPOINT_SECURITY_SETTING_RELATIONSHIP_TYPE =
  'group_assigned_endpoint_security_setting';
export const DEVICE_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE =
  'device_has_noncompliance_finding';
export const COMPLIANCE_POLICY_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE =
  'compliance_policy_identifies_noncompliance_finding';
export const DEVICE_COMPLIANCE_SCRIPT_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE =
  'device_compliance_script_identifies_noncompliance_finding';
export const ENDPOINT_SECURITY_SETTING_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE =
  'endpoint_security_setting_identifies_noncompliance_finding';
export const COMPLIANCE_ACTION_ITEM_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE =
  'compliance_action_item_mitigates_noncompliance_finding';
export const DEVICE_MANAGED_APPLICATION_RELATIONSHIP_TYPE =
  'device_assigned_managed_application';
export const MANAGED_APPLICATION_ENDPOINT_SECURITY_SETTING_RELATIONSHIP_TYPE =
  'managed_application_has_endpoint_security_setting';
export const APPLICATION_CATEGORY_MANAGED_APPLICATION_RELATIONSHIP_TYPE =
  'application_category_has_managed_application';
export const MANAGED_APPLICATION_APPLICATION_POLICY_RELATIONSHIP_TYPE =
  'managed_application_assigned_application_policy';
export const MANAGED_APPLICATION_APPLICATION_CONFIGURATION_RELATIONSHIP_TYPE =
  'managed_application_uses_application_configuration';
export const APPLICATION_CONFIGURATION_NONCOMPLIANCE_FINDING_RELATIONSHIP_TYPE =
  'application_configuration_identifies_device_noncompliance_finding';
