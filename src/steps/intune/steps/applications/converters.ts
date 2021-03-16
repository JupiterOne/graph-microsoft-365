import {
  IntegrationEntityData,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import {
  AndroidManagedStoreApp,
  ManagedApp,
  WebApp,
  IosLobApp,
  AndroidLobApp,
  WindowsPhoneXAP,
  MobileLobApp,
  DetectedApp,
} from '@microsoft/microsoft-graph-types-beta';
import { entities } from '../../constants';

// https://docs.microsoft.com/en-us/graph/api/resources/intune-shared-mobileapp?view=graph-rest-beta
export function mapManagedApplicationEntityValues(
  managedApp: ManagedApp & { '@odata.type': string },
): IntegrationEntityData['assign'] {
  return {
    _class: entities.MANAGED_APPLICATION._class,
    _type: entities.MANAGED_APPLICATION._type,
    id: managedApp.id,
    name: managedApp.displayName?.toLowerCase(),
    displayName: managedApp.displayName as string,
    description: managedApp.description,
    notes: managedApp.notes ? [managedApp.notes] : [],
    COTS: !isLineOfBusiness(managedApp['@odata.type']),
    external: !isLineOfBusiness(managedApp['@odata.type']),
    mobile: isMobile(managedApp['@odata.type']),
    productionURL:
      (managedApp as WebApp).appUrl ??
      (managedApp as AndroidManagedStoreApp).appStoreUrl,
    publisher: managedApp.publisher,
    isPublished: managedApp.publishingState === 'published', // Essentially if it is available for download
    createdOn: parseTimePropertyValue(managedApp.createdDateTime),
    lastUpdatedOn: parseTimePropertyValue(managedApp.lastModifiedDateTime),
    featured: managedApp.isFeatured, // Indicates that they are featuring this app on their Company Portal
    privacyInformationURL: managedApp.privacyInformationUrl,
    informationURL: managedApp.informationUrl,
    owner: managedApp.owner || undefined, // Ex: Microsoft, Google, Facebook...
    developer: managedApp.developer, // Almost always the same as the owner

    // Line of Business Apps
    newestVersion: findNewestVersion(managedApp),
    committedContentVersion: (managedApp as MobileLobApp)
      .committedContentVersion,
    packageId: (managedApp as AndroidLobApp).packageId,
  };
}

// https://docs.microsoft.com/en-us/graph/api/resources/intune-devices-detectedapp?view=graph-rest-beta
export function mapDetectedApplicationEntityValues(
  detectedApp: DetectedApp,
): IntegrationEntityData['assign'] {
  return {
    _class: entities.DETECTED_APPLICATION._class,
    _type: entities.DETECTED_APPLICATION._type,
    id: detectedApp.id,
    name: detectedApp.displayName?.toLowerCase(),
    displayName: detectedApp.displayName as string,
    sizeInByte: detectedApp.sizeInByte,
  };
}

export function findNewestVersion(
  managedApp: ManagedApp & WindowsPhoneXAP & AndroidLobApp & IosLobApp,
) {
  return (
    managedApp.identityVersion ??
    managedApp.versionName ??
    managedApp.versionCode ??
    managedApp.versionNumber ??
    managedApp.version ??
    'unversioned'
  );
}

/**
 * Line of business apps need to be manually uploaded to Azure ensuring that they are custom.
 * All other managed apps go throuhg an app store or a website (webApp).
 *
 * @param dataModel Microsoft datatype for the api response.
 * Examples: "#microsoft.graph.webApp", "#microsoft.graph.managedIOSStoreApp", "#microsoft.graph.androidLobApp"
 */
function isLineOfBusiness(dataModel: string) {
  return dataModel.toLowerCase().includes('lob');
}

/**
 *
 * @param dataModel Microsoft datatype for the api response.
 * Examples: "#microsoft.graph.androidStoreApp", "#microsoft.graph.managedIOSStoreApp", "#microsoft.graph.windowsMobileMSI", "#microsoft.graph.officeSuiteApp"
 */
function isMobile(dataModel: string) {
  return [
    'ios', // matches iPhone managed app types
    'android', // matches Android managed app types
    'mobile', // matches Windows phone app types
    'webApp', // webApps are availble for both mobile and desktop
  ].some((el) => dataModel.toLowerCase().indexOf(el) > -1);
}
