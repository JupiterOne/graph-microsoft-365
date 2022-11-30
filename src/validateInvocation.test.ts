import { createMockExecutionContext } from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from './types';
import { validateInvocation } from './validateInvocation';

test('config with missing fields fails to validate', async () => {
  const context = createMockExecutionContext<IntegrationConfig>({
    instanceConfig: {
      tenant: 'test',
    } as IntegrationConfig,
  });
  try {
    await validateInvocation(context);
  } catch (err) {
    expect(err.message).toEqual('Config requires: clientId, clientSecret');
  }
});
