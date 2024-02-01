import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

import { GraphClient } from './ms-graph/client';
import { IntegrationConfig } from './types';
import { VulnerabilitySeverity } from './steps/intune/types';

const validateVulnerabilitySeverities = (vulnerabilitySeverities: string) => {
  const vulnerabilitySeveritiesArray = vulnerabilitySeverities.split(',');
  const validSeverities = Object.values(VulnerabilitySeverity);
  for (const vulnerabilitySeverity of vulnerabilitySeveritiesArray) {
    if (
      !validSeverities.includes(vulnerabilitySeverity as VulnerabilitySeverity)
    ) {
      throw new IntegrationValidationError(
        `Severity - ${vulnerabilitySeverity} - is not valid. Valid vulnerability severities include ${validSeverities}`,
      );
    }
  }
};

export function validateExecutionConfig({
  instance,
  logger,
}: IntegrationExecutionContext<IntegrationConfig>): void {
  const { clientId, clientSecret, tenant, vulnerabilitySeverities } =
    instance.config;

  logger.info(
    {
      clientId,
      tenantId: tenant,
    },
    'Configured to make Microsoft Graph API calls to tenantId acting as clientId',
  );

  if (!clientId || !clientSecret || !tenant) {
    const missingFields: string[] = [];
    if (!clientId) missingFields.push('clientId');
    if (!clientSecret) missingFields.push('clientSecret');
    if (!tenant) missingFields.push('tenant');

    throw new IntegrationValidationError(
      `Config requires: ${missingFields.join(', ')}`,
    );
  }

  if (vulnerabilitySeverities) {
    instance.config.vulnerabilitySeverities = vulnerabilitySeverities.replace(
      /\s+/g,
      '',
    );
    validateVulnerabilitySeverities(instance.config.vulnerabilitySeverities);
  }
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  validateExecutionConfig(context);
  const apiClient = new GraphClient(context.logger, context.instance.config);
  await apiClient.verifyAuthentication();
}
