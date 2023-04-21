import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { Group } from '@microsoft/microsoft-graph-types';
import { Entities, Relationships } from '../constants';

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
        description: data.description ?? undefined,
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

export function createAccountGroupRelationship(
  account: Entity,
  group: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: group,
    properties: {
      _type: Relationships.ACCOUNT_HAS_GROUP._type,
    },
  });
}
