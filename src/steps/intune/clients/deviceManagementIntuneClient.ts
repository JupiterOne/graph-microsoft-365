import { GraphClient } from '../../../ms-graph/client';
import {
  ManagedDevice,
  DeviceConfiguration,
  DeviceCategory,
  DeviceConfigurationGroupAssignment,
  DeviceConfigurationDeviceStatus,
  DeviceCompliancePolicy,
  DeviceComplianceActionItem,
  DeviceComplianceDeviceStatus,
  DeviceCompliancePolicyAssignment,
  DeviceComplianceScript,
  DeviceComplianceScriptDeviceState,
  DeviceManagementSettingInstance,
  DeviceManagementIntentAssignment,
  DeviceManagementIntentDeviceState,
} from '@microsoft/microsoft-graph-types-beta';

class DeviceManagementIntuneClient extends GraphClient {
  //********** MANAGED DEVICES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-manageddevice?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-devices-manageddevice-list?view=graph-rest-1.0
  public async iterateManagedDevices(
    callback: (managedDevice: ManagedDevice) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: '/deviceManagement/managedDevices',
      callback,
    });
  }

  //********** AZURE DEVICES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/device?view=graph-rest-1.0
  // Another way to get devices that contains some different information. Currently not using.

  //********** DEVICE CATEGORIES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicecategory?view=graph-rest-1.0
  // DeviceManagementManagedDevices.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-shared-devicecategory-list?view=graph-rest-1.0
  public async iterateDeviceCategories(
    callback: (deviceCategory: DeviceCategory) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: '/deviceManagement/deviceCategories',
      callback,
    });
  }

  //********** DEVICE CONFIGURATIONS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-deviceconfiguration?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-shared-deviceconfiguration-list?view=graph-rest-beta
  public async iterateDeviceConfigurations(
    callback: (
      deviceConfiguration: DeviceConfiguration,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceConfigurations`,
      callback,
    });
  }

  // NOTE: This turns into a relationship to GROUPS
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-deviceconfigurationgroupassignment-list?view=graph-rest-beta
  public async iterateDeviceConfigurationGroupAssignments(
    deviceConfigurationId: string, // TODO: type
    callback: (
      groupAssignment: DeviceConfigurationGroupAssignment,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceConfigurations/${deviceConfigurationId}/groupAssignments`,
      callback,
    });
  }

  // NOTE: This turns into a relationship to MANAGED DEVICE
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-deviceconfigurationdevicestatus-list?view=graph-rest-beta
  public async iterateDeviceConfiguratinDeviceStatus(
    deviceConfigurationId: string,
    callback: (
      deviceConfigurationDeviceStatus: DeviceConfigurationDeviceStatus,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceConfigurations/${deviceConfigurationId}/deviceStatuses`,
      callback,
    });
  }

  //**********  DEVICE COMPLIANCE SCRIPTS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-devices-devicecompliancescript?view=graph-rest-beta
  // DeviceManagementManagedDevices.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-devices-devicecompliancescript-list?view=graph-rest-beta
  public async iterateDeviceComplianceScripts(
    callback: (
      deviceComplianceScript: DeviceComplianceScript,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: '/deviceManagement/deviceComplianceScripts',
      callback,
    });
  }

  // NOTE: This turns into a relationship to MANAGED DEVICE
  // https://docs.microsoft.com/en-us/graph/api/intune-devices-devicecompliancescriptdevicestate-list?view=graph-rest-beta
  public async iterateDeviceComplianceScriptDeviceStates(
    deviceComplianceScriptId: string,
    callback: (
      deviceState: DeviceComplianceScriptDeviceState,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceComplianceScripts/${deviceComplianceScriptId}/deviceRunStates`,
      callback,
    });
  }

  // NOTE: Only important if we want to get the malware states of Windows devices.
  // //**********  DEVICE MANAGEMENT SCRIPTS **********/
  //  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicemanagementscript?view=graph-rest-beta
  //  // DeviceManagementManagedDevices.Read.All

  // // https://docs.microsoft.com/en-us/graph/api/intune-shared-devicemanagementscript-list?view=graph-rest-beta
  // public async iterateDeviceManagementScripts (
  //     callback: (deviceManagementScript: DeviceManagementScript) => void | Promise<void>,
  // ): Promise<void> {
  //     return this.iterateResources({ resourceUrl: '/deviceManagement/deviceManagementScripts', callback });
  // }

  // // NOTE: This turns into a relationship to GROUPS
  // // https://docs.microsoft.com/en-us/graph/api/intune-devices-devicemanagementscriptgroupassignment-list?view=graph-rest-beta
  // public async iterateDeviceManagementScriptGroupAssignments (
  //     deviceManagementScriptId: string,
  //     callback: (groupScriptAssignment: DeviceManagementScriptGroupAssignment) => void | Promise<void>,
  // ): Promise<void> {
  //     return this.iterateResources({ resourceUrl: `/deviceManagement/deviceManagementScripts/${deviceManagementScriptId}/groupAssignments`, callback });
  // }

  // // NOTE: these will all be added into the MANAGED DEVICE entity as well as create a relationship to MANAGED DEVICE
  // // https://docs.microsoft.com/en-us/graph/api/intune-devices-devicemanagementscriptdevicestate-list?view=graph-rest-beta
  // public async iterateDeviceManagementScriptDeviceRunStates (
  //     deviceManagementScriptId: string,
  //     callback: (scriptDeviceRunState: DeviceManagementScriptDeviceState) => void | Promise<void>,
  // ): Promise<void> {
  //     return this.iterateResources({ resourceUrl: `/deviceManagement/deviceManagementScripts/${deviceManagementScriptId}/deviceRunStates`, callback });
  // }
  // // https://docs.microsoft.com/en-us/graph/api/intune-devices-windowsprotectionstate-get?view=graph-rest-beta
  // public async iterateWindowsProtectionStates (
  //     deviceManagementScriptId: string,
  //     deviceManagementScriptDeviceStateId: string,
  //     callback: (windowsProtectionState: WindowsProtectionState) => void | Promise<void>,
  // ): Promise<void> {
  //     return this.iterateResources({ resourceUrl: `/deviceManagement/deviceManagementScripts/${deviceManagementScriptId}/deviceRunStates/${deviceManagementScriptDeviceStateId}/managedDevice/windowsProtectionState`, callback });
  // }
  // // https://docs.microsoft.com/en-us/graph/api/intune-devices-windowsprotectionstate-get?view=graph-rest-beta
  // public async iterateWindowsMalwareStates (
  //     deviceManagementScriptId: string,
  //     deviceManagementScriptDeviceStateId: string,
  //     callback: (windowsMalwareState: WindowsDeviceMalwareState) => void | Promise<void>,
  // ): Promise<void> {
  //     return this.iterateResources({ resourceUrl: `/deviceManagement/deviceManagementScripts/${deviceManagementScriptId}/deviceRunStates/${deviceManagementScriptDeviceStateId}/managedDevice/windowsProtectionState/detectedMalwareState`, callback });
  // }
  // // NOTE: Could potentially load in all malware information instead of just the ones that match managed devices -- https://docs.microsoft.com/en-us/graph/api/intune-devices-windowsmalwareinformation-list?view=graph-rest-beta

  //********** DEVICE COMPLIANCE POLICIES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicecompliancepolicy?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-shared-devicecompliancepolicy-list?view=graph-rest-beta
  public async iterateDeviceCompliancePolicies(
    callback: (
      deviceCompliancePolicy: DeviceCompliancePolicy,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceCompliancePolicies`,
      callback,
    });
  }

  // Used only to get to the DeviceComplianceActionItems
  // // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-devicecompliancescheduledactionforrule-list?view=graph-rest-beta
  // public async iterateScheduledActionsForRule(
  //     deviceCompliancePolicyId: string,
  //     callback: (ScheduledActionForRule: DeviceComplianceScheduledActionForRule) => void | Promise<void>,
  // ): Promise<void> {
  //     return this.iterateResources({ resourceUrl: `/deviceManagement/deviceCompliancePolicies/${deviceCompliancePolicyId}/scheduledActionsForRule`, callback });
  // }
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-devicecomplianceactionitem-list?view=graph-rest-beta
  public async iterateDeviceComplianceActionItems(
    deviceCompliancePolicyId: string,
    deviceComplianceScheduledActionForRuleId: string,
    callback: (
      deviceComplianceActionItem: DeviceComplianceActionItem,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceCompliancePolicies/${deviceCompliancePolicyId}/scheduledActionsForRule/${deviceComplianceScheduledActionForRuleId}/scheduledActionConfigurations`,
      callback,
    });
  }

  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-devicecompliancedevicestatus-list?view=graph-rest-beta
  public async iterateDeviceComplianceDeviceStatuses(
    deviceCompliancePolicyId: string,
    callback: (
      deviceStatus: DeviceComplianceDeviceStatus,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceCompliancePolicies/${deviceCompliancePolicyId}/deviceStatuses`,
      callback,
    });
  }

  // NOTE: This turns into a relationship to GROUPS, USERS, and MANAGED DEVICE
  // DeviceManagementConfiguration.Read.All
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-devicecompliancepolicyassignment-list?view=graph-rest-beta
  public async iterateDeviceCompliancePolicyAssignments(
    deviceCompliancePolicyId: string,
    callback: (
      policyAssignment: DeviceCompliancePolicyAssignment,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceCompliancePolicies/${deviceCompliancePolicyId}/assignments`,
      callback,
    });
  }

  //********** DEVICE MANAGEMENT INTENTS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-deviceintent-devicemanagementintent?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  // NOTE: We don't care about the intent record itself, only to get to the settings and devices they relate to
  // // https://docs.microsoft.com/en-us/graph/api/intune-deviceintent-devicemanagementintent-list?view=graph-rest-beta
  // public async iterateIntents(
  //     callback: (intent: DeviceManagementIntent) => void | Promise<void>,
  // ): Promise<void> {
  //     return this.iterateResources({ resourceUrl: `/deviceManagement/intents`, callback });
  //}
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceintent-devicemanagementsettinginstance-list?view=graph-rest-beta
  public async iterateIntentSettings(
    deviceManagementIntentId: string,
    callback: (
      setting: DeviceManagementSettingInstance,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/intents/${deviceManagementIntentId}/settings`,
      callback,
    });
  }

  // NOTE: This turns into a relationship to GROUPS, USERS, and MANAGED DEVICE
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-deviceintent-devicemanagementintentassignment?view=graph-rest-beta
  public async iterateIntentAssignments(
    deviceManagementIntentId: string,
    callback: (
      intentAssignment: DeviceManagementIntentAssignment,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/intents/${deviceManagementIntentId}/assignments`,
      callback,
    });
  }

  // NOTE: This turns into a FINDING
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceintent-devicemanagementintentdevicestate-list?view=graph-rest-beta
  public async iterateIntentDeviceStates(
    deviceManagementIntentId: string,
    callback: (
      deviceState: DeviceManagementIntentDeviceState,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/intents/${deviceManagementIntentId}/deviceStates`,
      callback,
    });
  }

  // TODO: useful for Office 365
  //********************************************* OFFICE SETTINGS **********************************************/
  // https://config.office.com/api/OfficeSettings/policies
}
