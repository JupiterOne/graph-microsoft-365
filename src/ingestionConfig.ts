import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { IngestionSources } from './steps/constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [IngestionSources.GROUPS]: {
    title: 'Groups',
    description: 'Active Directory Groups and Group Members',
  },
  [IngestionSources.DEVICES]: {
    title: 'Devices',
    description:
      "Retrieve all Users' Devices and Host Agents from Microsoft Intune",
  },
  [IngestionSources.COMPLIANCE_POLICIES]: {
    title: 'Compliance Policies and Related Findings',
    description:
      'Access Device Compliance Policies and Non-Compliance Findings from Microsoft Intune',
  },
  [IngestionSources.DEVICE_CONFIGURATIONS]: {
    title: 'Device Configurations and Related Findings',
    description:
      'Retrieve Device Configurations and Non-Compliance Findings from Microsoft Intune',
  },
  [IngestionSources.APPLICATIONS]: {
    title: 'Applications',
    description:
      'Retrieve Managed and Detected Applications from Microsoft Intune to enhance application tracking and management.',
  },
};
