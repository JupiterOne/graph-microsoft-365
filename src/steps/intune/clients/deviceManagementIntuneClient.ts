import { GraphClient } from '../../../ms-graph/client';
import {
  DeviceComplianceDeviceStatus,
  DeviceCompliancePolicy,
  DeviceConfiguration,
  DeviceConfigurationDeviceStatus,
  ManagedApp,
  ManagedDevice,
} from '@microsoft/microsoft-graph-types-beta';
import { MobileAppInstallStatus } from '../types';

export class DeviceManagementIntuneClient extends GraphClient {
  //********** MANAGED DEVICES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-manageddevice?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-devices-manageddevice-list?view=graph-rest-1.0
  public async iterateManagedDevices(
    callback: (managedDevice: ManagedDevice) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl:
        'https://graph.microsoft.com/beta/deviceManagement/managedDevices',
      callback,
    });
  }

  // https://docs.microsoft.com/en-us/graph/api/intune-devices-detectedapp?view=graph-rest-beta
  public async iterateDetectedApps(
    deviceId: string,
    callback: (
      detectedApp: ManagedDevice & { '@odata.type': string },
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `https://graph.microsoft.com/beta/deviceManagement/manageddevices/${deviceId}`,
      query: {
        $expand: `detectedApps`,
      },
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

  // NOTE: This turns into a relationship with MANAGED DEVICE
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-deviceconfigurationdevicestatus-list?view=graph-rest-beta
  public async iterateDeviceConfigurationDeviceStatuses(
    deviceConfigurationId: string,
    callback: (
      deviceConfigurationDeviceStatus: DeviceConfigurationDeviceStatus,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceConfigurations/${deviceConfigurationId}/deviceStatuses`, // Filters are not supported in this enpoint
      callback,
    });
  }

  //*********** MANAGED APPS **************/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-mobileapp?view=graph-rest-beta
  // DeviceManagementApps.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-shared-mobileapp-list?view=graph-rest-beta
  public async iterateManagedApps(
    callback: (
      managedApp: ManagedApp & { '@odata.type': string },
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `https://graph.microsoft.com/beta/deviceAppManagement/mobileApps`,
      query: {
        // $top: '999', INT-8991: removing because its causing a 500 error in Microsoft
        $filter: `(isAssigned eq true or microsoft.graph.managedApp/appAvailability eq 'lineOfBusiness' or microsoft.graph.managedApp/appAvailability eq null)`,
      },
      callback,
    });
  }

  // NOTE: This becomes a relationship from mobileapp to device
  // There is not current documentation for this endpoint
  // Beta api changed, info:
  // https://techcommunity.microsoft.com/t5/intune-customer-success/support-tip-retrieving-intune-apps-reporting-data-from-microsoft/ba-p/3851578
  // https://github.com/microsoftgraph/msgraph-sdk-powershell/issues/2088
  // https://github.com/microsoftgraph/msgraph-sdk-powershell/issues/2074
  public async iterateManagedAppDeviceStatuses(
    mobileAppId: string,
    callback: (deviceStatus: MobileAppInstallStatus) => void | Promise<void>,
  ): Promise<void> {
    const api = this.client.api(
      'https://graph.microsoft.com/beta/deviceManagement/reports/getDeviceInstallStatusReport',
    );
    const res: NodeJS.ReadableStream = await api.post({
      filter: `(ApplicationId eq '${mobileAppId}')`,
    });

    let responseStr = '';
    for await (const chunk of res) {
      responseStr += Buffer.from(chunk).toString();
    }

    const response = JSON.parse(responseStr);
    for (const responseValue of response.Values) {
      const mobileAppInstallStatus = {};
      response.Schema.forEach((column, index) => {
        mobileAppInstallStatus[column.Column] = responseValue[index];
      });
      await callback(mobileAppInstallStatus as MobileAppInstallStatus);
    }
  }

  //********** DEVICE COMPLIANCE POLICIES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicecompliancepolicy?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  // https://docs.microsoft.com/en-us/graph/api/intune-shared-devicecompliancepolicy-list?view=graph-rest-beta
  public async iterateCompliancePolicies(
    callback: (
      compliancePolicy: DeviceCompliancePolicy,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/deviceManagement/deviceCompliancePolicies`,
      callback,
    });
  }

  // NOTE: This turns into a relationship with MANAGED DEVICE
  // https://docs.microsoft.com/en-us/graph/api/intune-deviceconfig-devicecompliancedevicestatus-list?view=graph-rest-beta
  public async iterateCompliancePolicyDeviceStatuses(
    deviceCompliancePolicyId: string,
    callback: (
      compliancePolicyDeviceStatus: DeviceComplianceDeviceStatus,
    ) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `https://graph.microsoft.com/beta/deviceManagement/deviceCompliancePolicies/${deviceCompliancePolicyId}/deviceStatuses`, // Filters are not supported in this enpoint
      callback,
    });
  }

  //***** CONDITIONAL ACCESS POLICIES *********/
  // https://docs.microsoft.com/en-us/graph/api/resources/conditionalaccesspolicy?view=graph-rest-beta
  // Major part of Intune that should eventually be ingested. Doles out conditional access to resources based on authentication
  // Should be an "AccessPolicy" class

  //********** AZURE DEVICES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/device?view=graph-rest-1.0
  // Another way to get devices that contains some different information. Currently not using.

  //********** DEVICE CATEGORIES **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicecategory?view=graph-rest-1.0
  // Groups of devices. Currently not using.

  //**********  DEVICE COMPLIANCE SCRIPTS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-devices-devicecompliancescript?view=graph-rest-beta
  // DeviceManagementManagedDevices.Read.All

  //********** DEVICE MANAGEMENT SCRIPTS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-devicemanagementscript?view=graph-rest-beta
  // Can be used to find computer-specific findings such as the Windows protection state. Currently not used
  // https://docs.microsoft.com/en-us/graph/api/intune-devices-windowsprotectionstate-get?view=graph-rest-beta

  //********** WINDOWS MALWARE STATE **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-devices-windowsmalwareinformation?view=graph-rest-beta
  // Can be used to get findings of malware on windows devices. Currently not used

  //********** DEVICE MANAGEMENT INTENTS **********/
  // https://docs.microsoft.com/en-us/graph/api/resources/intune-deviceintent-devicemanagementintent?view=graph-rest-beta
  // DeviceManagementConfiguration.Read.All

  //********** OFFICE SETTINGS **********/
  // https://config.office.com/api/OfficeSettings/policies
  // Intune has special policies specifically for Office 365 that you need to query for in a different way. Not currently using.
}
