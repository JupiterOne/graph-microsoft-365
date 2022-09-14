import {
  createIntegrationEntity,
  Entity,
  IntegrationInstance,
} from '@jupiterone/integration-sdk-core';
import { Organization } from '@microsoft/microsoft-graph-types';
import { Entities } from '../constants';

export function createAccountEntity(instance: IntegrationInstance): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _class: Entities.ACCOUNT._class,
        _key: `${Entities.ACCOUNT._type}-${instance.id}`,
        _type: Entities.ACCOUNT._type,
        name: instance.name,
        displayName: instance.name,
      },
    },
  });
}

export function createAccountEntityWithOrganization(
  instance: IntegrationInstance,
  organization: Organization,
  intuneConfig: {
    mobileDeviceManagementAuthority?: string;
    subscriptionState?: string;
    intuneAccountID?: string;
  },
): Entity {
  let defaultDomain: string | undefined;
  const verifiedDomains = organization.verifiedDomains?.map((e) => {
    if (e.isDefault) {
      defaultDomain = e.name as string | undefined;
    }
    return e.name as string;
  });

  return createIntegrationEntity({
    entityData: {
      source: {
        organization,
        intuneConfig,
      },
      assign: {
        _class: Entities.ACCOUNT._class,
        _key: `${Entities.ACCOUNT._type}-${instance.id}`,
        _type: Entities.ACCOUNT._type,
        id: organization.id,
        name: organization.displayName,
        displayName: instance.name,
        organizationName: organization.displayName,
        defaultDomain,
        verifiedDomains,
        intuneAccountId: intuneConfig?.intuneAccountID,
        mobileDeviceManagementAuthority:
          intuneConfig?.mobileDeviceManagementAuthority,
        intuneSubscriptionState: intuneConfig?.subscriptionState,
      },
    },
  });
}
