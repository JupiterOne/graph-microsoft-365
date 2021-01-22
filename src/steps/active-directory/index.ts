import {
  Entity,
  IntegrationStepExecutionContext,
  RelationshipClass,
  Step,
  StepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { DirectoryGraphClient } from './clients/directoryClient';
import {
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_GROUP_RELATIONSHIP_TYPE,
  ACCOUNT_USER_RELATIONSHIP_TYPE,
  GROUP_ENTITY_TYPE,
  GROUP_MEMBER_ENTITY_TYPE,
  GROUP_MEMBER_RELATIONSHIP_TYPE,
  STEP_ACCOUNT,
  STEP_GROUP_MEMBERS,
  STEP_GROUPS,
  STEP_USERS,
  USER_ENTITY_TYPE,
  ACCOUNT_ENTITY_CLASS,
  GROUP_MEMBER_ENTITY_CLASS,
} from './constants';
import {
  createAccountEntity,
  createAccountEntityWithOrganization,
  createAccountGroupRelationship,
  createAccountUserRelationship,
  createGroupEntity,
  createGroupMemberRelationship,
  createUserEntity,
} from './converters';

export * from './constants';

export async function fetchAccount(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  let accountEntity: Entity;
  try {
    const organization = await graphClient.fetchOrganization();
    accountEntity = createAccountEntityWithOrganization(instance, organization);
  } catch (err) {
    // TODO logger.authError()
    accountEntity = createAccountEntity(instance);
  }

  await jobState.addEntity(accountEntity);
  await jobState.setData(ACCOUNT_ENTITY_TYPE, accountEntity);
}

export async function fetchUsers(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const accountEntity = await jobState.getData<Entity>(ACCOUNT_ENTITY_TYPE);
  await graphClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);
    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
    );
  });
}

export async function fetchGroups(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const accountEntity = await jobState.getData<Entity>(ACCOUNT_ENTITY_TYPE);
  await graphClient.iterateGroups(async (group) => {
    const groupEntity = createGroupEntity(group);
    await jobState.addEntity(groupEntity);
    await jobState.addRelationship(
      createAccountGroupRelationship(accountEntity, groupEntity),
    );
  });
}

export async function fetchGroupMembers(
  executionContext: IntegrationStepContext,
): Promise<void> {
  const { logger, instance, jobState } = executionContext;
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  await jobState.iterateEntities(
    { _type: GROUP_ENTITY_TYPE },
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

export const activeDirectorySteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: STEP_ACCOUNT,
    name: 'Active Directory Info',
    entities: [
      {
        resourceName: '[AD] Account',
        _type: ACCOUNT_ENTITY_TYPE,
        _class: ACCOUNT_ENTITY_CLASS,
      },
    ],
    relationships: [],
    executionHandler: fetchAccount,
  },
  {
    id: STEP_USERS,
    name: 'Active Directory Users',
    entities: [
      {
        resourceName: '[AD] User',
        _type: USER_ENTITY_TYPE,
        _class: 'User',
      },
    ],
    relationships: [
      {
        _type: ACCOUNT_USER_RELATIONSHIP_TYPE,
        sourceType: ACCOUNT_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: USER_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_ACCOUNT],
    executionHandler: fetchUsers,
  },
  {
    id: STEP_GROUPS,
    name: 'Active Directory Groups',
    entities: [
      {
        resourceName: '[AD] Group',
        _type: GROUP_ENTITY_TYPE,
        _class: GROUP_ENTITY_TYPE,
      },
    ],
    relationships: [
      {
        _type: ACCOUNT_GROUP_RELATIONSHIP_TYPE,
        sourceType: ACCOUNT_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: GROUP_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_ACCOUNT],
    executionHandler: fetchGroups,
  },
  {
    id: STEP_GROUP_MEMBERS,
    name: 'Active Directory Group Members',
    entities: [
      {
        resourceName: '[AD] Group Member',
        _type: GROUP_MEMBER_ENTITY_TYPE,
        _class: GROUP_MEMBER_ENTITY_CLASS,
      },
    ],
    relationships: [
      {
        _type: 'azure_group_has_user',
        sourceType: GROUP_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: USER_ENTITY_TYPE,
      },
      {
        _type: 'azure_group_has_group',
        sourceType: GROUP_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: GROUP_ENTITY_TYPE,
      },
      {
        _type: GROUP_MEMBER_RELATIONSHIP_TYPE,
        sourceType: GROUP_ENTITY_TYPE,
        _class: RelationshipClass.HAS,
        targetType: GROUP_MEMBER_ENTITY_TYPE,
      },
    ],
    dependsOn: [STEP_GROUPS],
    executionHandler: fetchGroupMembers,
  },
];
