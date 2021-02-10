import {
  IntegrationInstanceConfig,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The Azure application client ID used to identify the program as the
   * registered app. This will be the same for all tenants since this is a
   * multi-tenant application.
   */
  clientId: string;

  /**
   * The Azurevv application client secret used to authenticate requests.
   */
  clientSecret: string;

  /**
   * The target Azure directory/tenant ID you would like to ingest entites from.
   * This can be found here: https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties
   *
   * NOTE:Not needed if authenticationTenant is provided.
   */
  ingestTenant?: string;

  /**
   * The authentication directory/tenant ID this is created upon a successful
   * admin consent OAuth flow.
   */
  authenticationTenant: string;
}

/**
 * An `IntegrationStepExecutionContext` typed for this integration's
 * `IntegrationInstanceConfig`.
 */
export type IntegrationStepContext = IntegrationStepExecutionContext<IntegrationConfig>;
