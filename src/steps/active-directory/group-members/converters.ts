import {
  Entity,
  Relationship,
  createMappedRelationship,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { GroupMember, MemberType } from '../clients/directoryClient';
import { Entities, Relationships } from '../constants';

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
