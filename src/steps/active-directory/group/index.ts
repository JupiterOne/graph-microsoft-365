import { Entity, IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../types';
import { DirectoryGraphClient } from '../clients/directoryClient';
import {
  DATA_ACCOUNT_ENTITY,
  Entities,
  Relationships,
  steps,
} from '../constants';
import {
  createAccountGroupRelationship,
  createGroupEntity,
} from './converters';
import { IngestionSources } from '../../constants';

export const groupSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: steps.FETCH_GROUPS,
    ingestionSourceId: IngestionSources.GROUPS,
    name: 'Active Directory Groups',
    entities: [Entities.GROUP],
    relationships: [Relationships.ACCOUNT_HAS_GROUP],
    dependsOn: [steps.FETCH_ACCOUNT],
    executionHandler: fetchGroups,
  },
];

export async function fetchGroups({
  logger,
  instance,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const accountEntity = await jobState.getData<Entity>(DATA_ACCOUNT_ENTITY);
  if (!accountEntity) {
    logger.warn('Error fetching groups: accountEntity does not exist');
    return;
  }
  await graphClient.iterateGroups(async (group) => {
    const groupEntity = createGroupEntity(group);
    await jobState.addEntity(groupEntity);
    await jobState.addRelationship(
      createAccountGroupRelationship(accountEntity, groupEntity),
    );
  });
}
