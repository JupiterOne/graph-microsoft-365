import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../types';
import { DirectoryGraphClient } from '../clients/directoryClient';
import { DATA_ACCOUNT_ENTITY, Entities, steps } from '../constants';
import { createAccountEntityWithOrganization } from './converters';

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: steps.FETCH_ACCOUNT,
    name: 'Active Directory Info',
    entities: [Entities.ACCOUNT],
    relationships: [],
    executionHandler: fetchAccount,
  },
];

export async function fetchAccount({
  logger,
  instance,
  jobState,
}: IntegrationStepContext): Promise<void> {
  const graphClient = new DirectoryGraphClient(logger, instance.config);

  const organization = await graphClient.fetchOrganization();
  let intuneAccountID: string | undefined;
  let subscriptionState: string | undefined;
  let mobileDeviceManagementAuthority: string | undefined;
  try {
    intuneAccountID = (await graphClient.getIntuneAccountId())?.intuneAccountId;
    subscriptionState = (await graphClient.getIntuneSubscriptionState())?.value;
    mobileDeviceManagementAuthority = (
      await graphClient.getMobileDeviceManagementAuthority(
        organization.id as string,
      )
    )?.mobileDeviceManagementAuthority;
  } catch (error) {
    intuneAccountID = undefined;
    subscriptionState = undefined;
    mobileDeviceManagementAuthority = undefined;
  }

  const accountEntity = createAccountEntityWithOrganization(
    instance,
    organization,
    { intuneAccountID, subscriptionState, mobileDeviceManagementAuthority },
  );
  await jobState.addEntity(accountEntity);
  await jobState.setData(DATA_ACCOUNT_ENTITY, accountEntity);
}
