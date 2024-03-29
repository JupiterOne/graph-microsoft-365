import {
  Entity,
  createIntegrationEntity,
  Relationship,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { User } from '@microsoft/microsoft-graph-types';
import { Entities } from '../constants';

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
        firstName: data.givenName ?? data.displayName?.split(' ')[0],
        jobTitle: data.jobTitle,
        email: data.mail ?? undefined,
        mail: data.mail ?? undefined,
        mobilePhone: data.mobilePhone,
        officeLocation: data.officeLocation,
        preferredLanguage: data.preferredLanguage,
        surname: data.surname,
        lastName: data.surname ?? data.displayName?.split(' ').slice(-1)[0],
        userPrincipalName: data.userPrincipalName,
        id: data.id,
        userType: data.userType,
        active: data.accountEnabled,
        accountEnabled: data.accountEnabled,
        usageLocation: data.usageLocation,
        ...((data as any).signInActivity ?? {}),
      },
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
