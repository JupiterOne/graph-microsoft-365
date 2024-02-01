import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  clientId: {
    type: 'string',
  },
  clientSecret: {
    type: 'string',
    mask: true,
  },
  tenant: {
    type: 'string',
  },
  vulnerabilitySeverities: {
    type: 'string',
    mask: false,
    optional: true,
  },
};

export default instanceConfigFields;
