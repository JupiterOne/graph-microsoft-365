import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const steps: Record<string, string> = {
  FETCH_ACCOUNT: 'account',
  FETCH_GROUPS: 'groups',
  FETCH_GROUP_MEMBERS: 'group-members',
  FETCH_USERS: 'users',
};

export const Entities: Record<
  'ACCOUNT' | 'GROUP' | 'USER' | 'ORGANIZATION' | 'GROUP_MEMBER',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: '[AD] Account',
    _type: 'microsoft_365_account',
    _class: ['Account'],
  },
  GROUP: {
    resourceName: '[AD] Group',
    _type: 'azure_user_group',
    _class: ['UserGroup'],
  },
  USER: {
    resourceName: '[AD] User',
    _type: 'azure_user',
    _class: ['User'],
  },
  ORGANIZATION: {
    resourceName: '[AD] Organization',
    _type: 'azure_organization',
    _class: ['Organization'],
  },
  /**
   * The entity used for members of groups which are not one of the ingested
   * directory objects.
   */
  GROUP_MEMBER: {
    resourceName: '[AD] Group Member',
    _type: 'azure_group_member',
    _class: ['User'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_GROUP'
  | 'GROUP_HAS_MEMBER'
  | 'GROUP_HAS_USER'
  | 'GROUP_HAS_GROUP',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'microsoft_365_account_has_azure_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'microsoft_365_account_has_azure_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  GROUP_HAS_MEMBER: {
    _type: 'azure_group_has_member',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP_MEMBER._type,
  },
  GROUP_HAS_USER: {
    _type: 'azure_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  GROUP_HAS_GROUP: {
    _type: 'azure_group_has_group',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
};

export const DATA_ACCOUNT_ENTITY = Entities.ACCOUNT._type;
