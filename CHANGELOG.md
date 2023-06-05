# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 6.6.0 - 2023-06-06

### Added

- Device entities now have the following new properties:

  | Property             | Type   |
  | -------------------- | ------ |
  | `enrolledDateTime`   | `date` |
  | `lastSyncDateTime`   | `date` |
  | `lastUpdateDateTime` | `date` |

## 6.5.0 - 2023-05-17

### Added

- Device entities now have the following new properties:

  | Property     | Type     |
  | ------------ | -------- |
  | `lastSeenOn` | `number` |

## 6.4.7 - 2023-01-23

### Changed

- Added `deviceCategoryDisplayName` to managed device entities.

## 6.4.6 - 2023-01-18

### Changed

- Added active, accountEnabled, and userType to user entity.

## 6.4.5 - 2022-11-30

### Changed

- Improved error messaging when `validateInvocation` fails

## 6.4.4 - 2022-10-13

### Changed

- Added warn log in Device Configuration step

## 6.4.3 - 2022-09-28

### Changed

- update sdk

## 6.4.2 - 2022-09-15

### Changed

- refactored existing `activeDirectory` steps
- Set page size to `999` for managed apps, users, groups, and group members.

## 6.4.1 - 2022-08-23

### Fixed

- Check for duplicate `user_uses_{device}` relationships before adding them.

## 6.4.0 - 2022-08-23

### Added

- Added `azure_user_uses_{device_type}` relationship

## 6.3.3 - 2022-08-22

### Added

- added option to enable raw data for managed devices

## 6.3.2 - 2022-07-12

### Fixed

- Integration no longer sets `jailBroken` to `true` when response from API is
  `"jailBroken": "Unknown"`. It is now set to undefined.

## 6.3.1 - 2022-06-28

### Changed

- Increased client timeout to 30s

## 6.3.0 - 2022-06-27

### Changed

- `macAddress` properties on managed devices are now normalized to a
  `aa:bb:cc:11:22:33` format

## 6.2.1 - 2022-06-25

### Changed

- Add default timeout to MS365 requests
- Remove unnecessary step dependency
- Remove use of async `jobState.hasKey`

## 6.2.0 - 2022-06-22

### Added

- `macAddress`, `ipAddress`, `hostname`, and `ethernetMacAddress` properties
  added to managed device entities ("Host", "Device").

## 6.1.4 - 2022-06-14

### Changed

- Updated SDK Dependency to `8.14.0`
- Added `graph:dependencies` command

## 6.1.3 - 2022-05-20

### Changed

- Updated error message logging for client

## 6.1.2 - 2022-05-19

### Changed

- Updated `APIClient` retry logic to include additional `statusCode`s. These
  changes go towards reducing the impact of `FetchErrors` and other retryable
  API responses that previously would have been thrown as
  `IntegrationProviderAPIError`

## 6.1.1 - 2022-05-05

### Added

- `code-ql` workflow
- `questions` workflow
- managed-questions

## 6.1.0 - 2022-04-11

### Changed

- Updated `@jupiterone/integration-sdk-*` to `8.10.1`.

### Added

- Added `deviceId` property to `Device` entities to conform to
  `@jupiterone/data-model`. The property is set to `null`.

## 6.0.1 - 2022-03-31

### Changed

- Added `sizeInByte` and `version` to the managed application entity.

## 6.0.0 - 2022-03-21

### Changed

- **BREAKING** - Update `_type` of `smartphone` entity to `user_endpoint` when
  the device has a `deviceType` with value `windowsRT`

- Update integration SDK packages to v8.6.4

## 5.0.0 - 2022-03-21

### Changed

- SDK version changed to `v8.6.3`
- Changed all `_class`es to `[]string` from `string`
- Converters now use explicit `_key`s instead of inheriting from `id`
- A single test in `src/steps/active-directory/__tests__/index.test.ts` now uses
  `matchRequestBy: { order: false }`

## 4.0.4 - 2022-03-15

### Changed

- Minor refactors and additional debug logging

## 4.0.3 - 2022-03-14

### Fixed

- Removed `raw_data` from Compliance Policy Entity

## 4.0.2 - 2022-03-11

### Fixed

- Removed `raw_data` from Detected Application Entity
- Added duplicate key check in `detected-applications` step

## 4.0.1 - 2021-10-30

- Add a few development conveniences

## 4.0.0 - 2021-10-27

### Changed

- Upgrade `@jupiterone/integration-sdk-*` packages
- Removed unused developer dependencies

## 3.0.10 - 2021-08-11

### Fixed

- Deduplicate `intune_noncompliance_finding` entities

## 3.0.9 - 2021-08-11

### Changed

- Removed relationships between `intune_managed_application` and
  `intune_detected_application` entities.

### Fixed

- Fixed duplicate key errors with `intune_managed_application` entities
- Deduplicate `intune_host_agent_assigned_compliance_policy` relationships
- Deduplicate `intune_noncompliance_finding` entities

## 3.0.8 - 2021-08-06

### Changed

- Removed raw data from `user` and `group` entities to fix lambda timeout.

## 3.0.7 - 2021-07-12

### Fixed

- Deduplicate `intune_managed_app_manages_intune_detected_app` relationships

## 3.0.6 - 2021-07-10

### Changed

- Removed raw data from `device` entities to fix lambda timeout.
- Un-decoupled `device` step and `host-agent` step.

## 3.0.5 - 2021-07-08

### Changed

- Decouple `device` step and `host-agent` step.

## 3.0.4 - 2021-07-07

### Changed

- Remove promise.all in device step.
- Explicitly look for duplicate keys in device finding step. Log on encounters.

## 3.0.2 - 2021-07-06

### Changed

- Explicitly look for duplicate keys in managed application step. Log on
  encounters.

## 3.0.1 - 2021-06-30

### Fixed

- Used unique `deviceStatus.id` for `_key` property of host agent ->
  configuration relationships.
- Used unique `deviceStatus.id` for `_key` property of device -> managed
  application relationships.
- Reconfigured where the callback function is called in the client such that
  callback errors (such as `DUPLICATE_KEY_ERROR`) are not sent to the
  `handleApiError` method.

## 3.0.0 - 2020-03-18

### Updated

- `jupiterone.md` and `development.md` documentation to include descriptions for
  scopes.

### Changed

- the `intune_managed_device` to `intune_detected_application` relationship
  class from **HAS** to **INSTALLED**
- `intune_managed_device` to `intune_detected_application` relationships to
  include `installedVersion`, and `detectionId` properties and allow multiple
  relationships to the same application based on the `detectionId`
- the `_key` property on `intune_detected_application` from the device id to
  `IntuneDetected:` plus the application name
- the `_key` property on `intune_managed_application` from the device id to
  `IntuneManaged:` plus the application name

### Added

- New relationships

  - Intune
    - `intune_managed_application` **MANAGES** `intune_detected_application`

- `mobileDeviceManagementAuthority`, `intuneSubscriptionState`, and
  `intuneAccountId` properties to `intune_managed_device` entities

### Changed

- Only ingest Intune data if the Microsoft 365 account has Intune configured
- A dummy `Account` entity will no longer be created when there is an error
  fetching organization data. Instead, the integration will fail and a message
  will be sent to the user in the job log.

### Added

- A class of `CompliancePolicy` to `intune_compliance_policy` and
  `intune_device_configuration` entities
- `category` property to `intune_compliance_policy` and
  `intune_device_configuration` entities.

- Support for ingesting the following **new** resources

- New relationships

  - Intune
    - `intune_host_agent` **ASSIGNED** `intune_compliance_policy`
    - `intune_host_agent` **ASSIGNED** `intune_device_configuration`
    - `intune_host_agent` **MANAGES** `computer`
    - `intune_host_agent` **MANAGES** `desktop`
    - `intune_host_agent` **MANAGES** `laptop`
    - `intune_host_agent` **MANAGES** `server`
    - `intune_host_agent` **MANAGES** `smartphone`
    - `intune_host_agent` **MANAGES** `user_endpoint`
    - `intune_host_agent` **MANAGES** `workstation`

- New entities

  - Intune
    - `intune_host_agent`

### Removed

- Removed relationships

  - Intune
    - `computer` **ASSIGNED** `intune_compliance_policy`
    - `computer` **USES** `intune_device_configuration`
    - `desktop` **ASSIGNED** `intune_compliance_policy`
    - `desktop` **USES** `intune_device_configuration`
    - `laptop` **ASSIGNED** `intune_compliance_policy`
    - `laptop` **USES** `intune_device_configuration`
    - `server` **ASSIGNED** `intune_compliance_policy`
    - `server` **USES** `intune_device_configuration`
    - `smartphone` **ASSIGNED** `intune_compliance_policy`
    - `smartphone` **USES** `intune_device_configuration`
    - `user_endpoint` **ASSIGNED** `intune_compliance_policy`
    - `user_endpoint` **USES** `intune_device_configuration`
    - `workstation` **ASSIGNED** `intune_compliance_policy`
    - `workstation` **USES** `intune_device_configuration`

### Updated

- README.md to include CI build badges

### Changed

- The type of `intune_managed_device` was changed to more accurately describe
  the hardware of the device. The new device types are `user_endpoint`,
  `workstation`, `laptop`, `desktop`, `computer`, `smartphone`, `tablet`
- The class of `intune_managed_device` only includes `Device` if the device is
  not a virtual machine

### Added

- `deviceType` and `function` properties to `intune_managed_device` entities
- `function` property to `intune_device_configuration` entities

- Support for ingesting the following **new** resources

- New relationships

  - Intune
    - `intune_managed_device` **ASSIGNED** `intune_compliance_policy`
    - `intune_compliance_policy` **IDENTIFIED** `intune_noncompliance_finding`

- New entities

  - Intune
    - `intune_compliance_policy`

## 2.1.1 - 2020-03-05

### Added

- `compliance` key to `intune_managed_device` entities

## 2.1.0 - 2020-03-05

### Changed

- The class of `intune_managed_device` entities from `Device` to
  `[Device, Host]`

## 2.0.0 - 2020-03-01

### Added

- Support for ingesting the following **new** resources

- New relationships

  - Intune
    - `azure_user` **HAS** `intune_managed_device`
    - `intune_managed_device` **USES** `intune_device_configuration`
    - `intune_device_configuration` **IDENTIFIED**
      `intune_noncompliance_finding`
    - `intune_managed_device` **HAS** `intune_noncompliance_finding`
    - `intune_managed_device` **HAS** `intune_detected_application`
    - `intune_managed_device` **ASSIGNED** `intune_managed_application`

- New entities

  - Intune
    - `intune_managed_device`
    - `intune_device_configuration`
    - `intune_noncompliance_finding`
    - `intune_managed_application`
    - `intune_detected_application`

### Updated

- Updated jupiterone.md documentation.
- Microsoft Graph client to handle individual api calls as well as iterative
  calls.
- The severity of an `unknown` finding from 1 to 4

### Changed

- Azure Active Directory entities and relationships to have a type of `azure_`
  to match [the Azure graph project](https://github.com/JupiterOne/graph-azure)

### Fixed

- Sporadic authentication bug with Microsoft Graph sdk.

## 1.0.1 - 2020-02-10

### Updated

- Updated documentation.

## 1.0.0 - 2020-02-05

Initial beta release.

## 0.0.0 - 2020-01-25

Initial commit.
