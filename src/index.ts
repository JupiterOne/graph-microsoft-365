import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

import instanceConfigFields from './instanceConfigFields';
import { activeDirectorySteps } from './steps/active-directory';
import { intuneSteps } from './steps/intune';
import { IntegrationConfig } from './types';
import validateInvocation from './validateInvocation';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [
    ...activeDirectorySteps,
    // Commenting out until all entities are ingested. This prevents the J1_DOCUMENTATION from documenting entities and relationships that don't exist yet.
    // ...intuneSteps
  ],
};
