import {
  IntegrationExecutionContext,
  IntegrationWarnEventName,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../types';
import { intuneSteps } from '../steps/intune';
import { integrationSteps } from '../';
import { set } from 'lodash';
import { GraphClient } from '../ms-graph/client';
import { logger } from '@azure/identity';
import { validateExecutionConfig } from '../validateInvocation';
import { steps } from '../steps/intune/constants';

export async function getStepStartStates(
  executionContext: IntegrationExecutionContext<IntegrationConfig>,
): Promise<StepStartStates> {
  validateExecutionConfig(executionContext);

  const stepIdsToDisable: string[] = [];
  if (!(await integrationHasIntune(executionContext))) {
    stepIdsToDisable.push(...intuneSteps.map((s) => s.id));
  }

  executionContext.logger.publishWarnEvent({
    name: 'step_skip' as IntegrationWarnEventName,
    description: `Step ${steps.FETCH_MANAGED_APPLICATIONS} is temporarily disabled due to active issues with Microsoft.`,
  });

  return integrationSteps.reduce(
    (startStates, step) =>
      set(
        startStates,
        `${step.id}.disabled`,
        stepIdsToDisable.includes(step.id) ||
          step.id === steps.FETCH_MANAGED_APPLICATIONS,
      ),
    {},
  );
}

/**
 * An account that does not have any sort of Mobile Device Management will throw an error.
 * An account that uses Office 365 Basic MDM will not have an Intune Account Id
 */
async function integrationHasIntune(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const apiClient = new GraphClient(context.logger, context.instance.config);
  try {
    return (await apiClient.getIntuneAccountId())?.intuneAccountId;
  } catch (err) {
    logger.info('Intune is not set up for this account', err);
  }
}
