import { GraphClient } from '../../../ms-graph/client';
import {
  ManagedAppPolicy,
  ManagedDeviceMobileAppConfiguration,
  ManagedDeviceMobileAppConfigurationDeviceStatus,
  MobileAppAssignment,
  MobileAppCategory,
  MobileAppInstallStatus,
} from '@microsoft/microsoft-graph-types-beta';
import { ManagedApp } from '@microsoft/microsoft-graph-types';

class MobileManagementIntuneClient extends GraphClient {
  //*********** MANAGED APPS **************/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-mobileapp?view=graph-rest-beta
  // DeviceManagementApps.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-shared-mobileapp-list?view=graph-rest-beta
  public async iterateManagedApps(
    callback: (managedApp: ManagedApp) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceAppManagement/mobileApps`,
      callback,
    });
  }

  // NOTE: This becomes a relationship from mobileapp to policy
  // https://docs.microsoft.com/en-us/graph/api/intune-apps-mobileappassignment-list?view=graph-rest-beta
  public async iterateManagedAppAssignments(
    mobileAppId: string,
    callback: (assignment: MobileAppAssignment) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceAppManagement/mobileApps/${mobileAppId}/assignments`,
      callback,
    });
  }

  // NOTE: This becomes a relationship from mobileapp to device
  // https://docs.microsoft.com/en-us/graph/api/intune-apps-mobileappinstallstatus-list?view=graph-rest-beta
  public async iterateManagedAppDeviceStatuses(
    mobileAppId: string,
    callback: (deviceStatus: MobileAppInstallStatus) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceAppManagement/mobileApps/${mobileAppId}/deviceStatuses`,
      callback,
    });
  }

  //*********** MOBILE APP CATEGORIES **************/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-apps-mobileappcategory?view=graph-rest-beta
  // DeviceManagementApps.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-apps-mobileappcategory-list?view=graph-rest-beta
  public async iterateMobileAppCategories(
    callback: (mobileAppCategory: MobileAppCategory) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceAppManagement/mobileAppCategories`,
      callback,
    });
  }

  //*********** MANAGED APP POLICIES **************/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-mam-managedapppolicy?view=graph-rest-beta
  // DeviceManagementApps.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-mam-managedapppolicy-list?view=graph-rest-beta
  public async iterateManagedAppPolicies(
    callback: (appPolicy: ManagedAppPolicy) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceAppManagement/managedAppPolicies`,
      callback,
    });
  }

  // TODO: include policy groups

  // NOTE: need to pull out the relevant OS specific policy type from the response of managedAppPolicies to select the correct endpoint needed to attach to apps and assignments
  // Assignments
  // https://docs.microsoft.com/en-us/graph/api/intune-mam-targetedmanagedapppolicyassignment-list?view=graph-rest-1.0
  // GET /deviceAppManagement/iosManagedAppProtections/{iosManagedAppProtectionId}/assignments
  // GET /deviceAppManagement/androidManagedAppProtections/{androidManagedAppProtectionId}/assignments
  // GET /deviceAppManagement/targetedManagedAppConfigurations/{targetedManagedAppConfigurationId}/assignments
  // GET /deviceAppManagement/windowsInformationProtectionPolicies/{windowsInformationProtectionPolicyId}/assignments
  // GET /deviceAppManagement/mdmWindowsInformationProtectionPolicies/{mdmWindowsInformationProtectionPolicyId}/assignments
  // Apps
  // UNDOCUMENTED
  // GET /deviceAppManagement/iosManagedAppProtections/{iosManagedAppProtectionId}/applications
  // GET /deviceAppManagement/androidManagedAppProtections/{androidManagedAppProtectionId}/applications
  // GET /deviceAppManagement/targetedManagedAppConfigurations/{targetedManagedAppConfigurationId}/applications
  // GET /deviceAppManagement/windowsInformationProtectionPolicies/{windowsInformationProtectionPolicyId}/applications
  // GET /deviceAppManagement/mdmWindowsInformationProtectionPolicies/{mdmWindowsInformationProtectionPolicyId}/applications

  //***********  MANAGED APP CONFIGURATIONS **************/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-apps-manageddevicemobileappconfiguration?view=graph-rest-beta
  // DeviceManagementApps.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-apps-manageddevicemobileappconfiguration-list?view=graph-rest-beta
  public async iterateMobileAppConfigurations(
    callback: (
      mobileAppConfiguration: ManagedDeviceMobileAppConfiguration,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceAppManagement/mobileAppConfigurations`,
      callback,
    });
  }

  // NOTE: This turns into a relationship to MANAGED DEVICE
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-deviceconfigurationdevicestatus-list?view=graph-rest-beta
  public async iterateMobileAppConfigurationDiviceStatus(
    managedDeviceMobileAppConfigurationId: string,
    callback: (
      deviceStatus: ManagedDeviceMobileAppConfigurationDeviceStatus,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceAppManagement/mobileAppConfigurations/${managedDeviceMobileAppConfigurationId}/deviceStatuses`,
      callback,
    });
  }
}
