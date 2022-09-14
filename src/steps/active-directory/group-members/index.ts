import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../types';
import { DirectoryGraphClient } from '../clients/directoryClient';
import { Entities, Relationships, steps } from '../constants';
import { createGroupMemberRelationship } from './converters';

export const groupMembersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: steps.FETCH_GROUP_MEMBERS,
    name: 'Active Directory Group Members',
    entities: [Entities.GROUP_MEMBER],
    relationships: [
      Relationships.GROUP_HAS_USER,
      Relationships.GROUP_HAS_GROUP,
      Relationships.GROUP_HAS_MEMBER,
    ],
    dependsOn: [steps.FETCH_GROUPS],
    executionHandler: fetchGroupMembers,
  },
];

export async function fetchGroupMembers({
  instance,
  logger,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  await jobState.iterateEntities(
    { _type: Entities.GROUP._type },
    async (groupEntity) => {
      await graphClient.iterateGroupMembers(
        { groupId: groupEntity.id as string },
        async (groupMember) => {
          await jobState.addRelationship(
            createGroupMemberRelationship(groupEntity, groupMember),
          );
        },
      );
    },
  );
}
