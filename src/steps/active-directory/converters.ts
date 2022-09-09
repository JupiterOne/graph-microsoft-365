import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  IntegrationInstance,
  Relationship,
  RelationshipDirection,
  RelationshipClass,
  createMappedRelationship,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Group, Organization, User } from '@microsoft/microsoft-graph-types';

import { GroupMember, MemberType } from './clients/directoryClient';
import { Entities, Relationships } from './constants';

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

export function createGroupEntity(data: Group): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {}, // removed due to size
      assign: {
        _class: Entities.GROUP._class,
        _type: Entities.GROUP._type,
        _key: data.id!,
        name: data.displayName,
        displayName: data.displayName as string | undefined,
        id: data.id,
        deletedOn: parseTimePropertyValue(data.deletedDateTime),
        classification: data.classification,
        createdOn: parseTimePropertyValue(data.createdDateTime),
        description: data.description,
        email: data.mailEnabled ? data.mail : undefined,
        mail: data.mailEnabled ? data.mail : undefined,
        mailEnabled: data.mailEnabled,
        mailNickname: data.mailNickname,
        renewedOn: parseTimePropertyValue(data.renewedDateTime),
        securityEnabled: data.securityEnabled,
      },
    },
  });
}

export function generateUserKey(user: User): string {
  return user.id as string;
}

export function createUserEntity(data: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {}, // removed due to size
      assign: {
        _key: generateUserKey(data),
        _class: Entities.USER._class,
        _type: Entities.USER._type,
        name: data.displayName,
        username: data.userPrincipalName,
        displayName: data.displayName as string | undefined,
        givenName: data.givenName,
        firstName: data.givenName,
        jobTitle: data.jobTitle,
        email: data.mail ?? undefined,
        mail: data.mail ?? undefined,
        mobilePhone: data.mobilePhone,
        officeLocation: data.officeLocation,
        preferredLanguage: data.preferredLanguage,
        surname: data.surname,
        lastName: data.surname,
        userPrincipalName: data.userPrincipalName,
        id: data.id,
      },
    },
  });
}

export function createOrganizationEntity(data: Organization): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: data.id!,
        _class: Entities.ORGANIZATION._class,
        _type: Entities.ORGANIZATION._type,
        website: data.verifiedDomains?.map((domain) => domain.name).join(', '),
        emailDomain: data.verifiedDomains
          ?.filter((domain) => domain.capabilities?.includes('Email'))
          .map((domain) => domain.name)
          .join(', '),
        external: undefined,
      },
    },
  });
}

export function createAccountGroupRelationship(
  account: Entity,
  group: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    fromKey: account._key,
    fromType: Entities.ACCOUNT._type,
    toKey: group.id as string,
    toType: Entities.GROUP._type,
    properties: {
      _type: Relationships.ACCOUNT_HAS_GROUP._type,
    },
  });
}

export function createAccountUserRelationship(
  account: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: user,
  });
}

export function createGroupMemberRelationship(
  group: Entity,
  member: GroupMember,
): Relationship {
  const memberEntityType = getGroupMemberEntityType(member);
  const memberEntityClass = getGroupMemberEntityClass(member);

  return createMappedRelationship({
    _class: RelationshipClass.HAS,
    _type: Relationships.GROUP_HAS_MEMBER._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: group._key,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _key: member.id,
        _type: memberEntityType,
        _class: memberEntityClass,
        displayName: member.displayName,
        jobTitle: member.jobTitle,
        email: member.mail,
      },
    },
    properties: {
      groupId: group.id as string,
      memberId: member.id,
      memberType: member['@odata.type'],
    },
  });
}

function getGroupMemberEntityType(member: GroupMember): string {
  switch (member['@odata.type']) {
    case MemberType.USER:
      return Entities.USER._type;
    case MemberType.GROUP:
      return Entities.GROUP._type;
    default:
      return Entities.GROUP_MEMBER._type;
  }
}

function getGroupMemberEntityClass(member: GroupMember): string | string[] {
  switch (member['@odata.type']) {
    case MemberType.USER:
      return Entities.USER._class;
    case MemberType.GROUP:
      return Entities.GROUP._class;
    default:
      return Entities.GROUP_MEMBER._class;
  }
}
