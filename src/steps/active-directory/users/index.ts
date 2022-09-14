import { Entity, IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../types';
import { DirectoryGraphClient } from '../clients/directoryClient';
import {
  DATA_ACCOUNT_ENTITY,
  Entities,
  Relationships,
  steps,
} from '../constants';
import { createAccountUserRelationship, createUserEntity } from './converters';

export const usersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: steps.FETCH_USERS,
    name: 'Active Directory Users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [steps.FETCH_ACCOUNT],
    executionHandler: fetchUsers,
  },
];

export async function fetchUsers({
  logger,
  instance,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const accountEntity = await jobState.getData<Entity>(DATA_ACCOUNT_ENTITY);
  if (!accountEntity) {
    logger.warn('Error fetching users: accountEntity does not exist');
    return;
  }
  await graphClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);
    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
    );
  });
}
