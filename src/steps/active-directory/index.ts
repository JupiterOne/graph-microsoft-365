import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../types';
import { accountSteps } from './account';
import { groupSteps } from './group';
import { groupMembersSteps } from './group-members';
import { usersSteps } from './users';

export * from './constants';

export const activeDirectorySteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [...usersSteps, ...accountSteps, ...groupSteps, ...groupMembersSteps];
