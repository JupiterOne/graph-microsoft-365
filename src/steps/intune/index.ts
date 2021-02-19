import { deviceManagementSteps } from './deviceManagementSteps';
import { deviceSteps } from './deviceSteps';
import { mobileManagementSteps } from './mobileManagementSteps';

export const intuneSteps = [
  ...deviceSteps,
  ...deviceManagementSteps,
  ...mobileManagementSteps,
];
