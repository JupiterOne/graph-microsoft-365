import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchDeviceConfigurations } from '..';
import { entities } from '../../../constants';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetchDeviceConfigurations', () => {
  test('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchDeviceConfigurations',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });
    await fetchDeviceConfigurations(context);

    const deviceConfiguration = context.jobState.collectedEntities;

    // Check that we have configurations
    expect(deviceConfiguration.length).toBeGreaterThan(0);

    // Check that we have only ingested Device Configurations
    deviceConfiguration.forEach((configuration) => {
      expect(configuration._type).toBe(entities.DEVICE_CONFIGURATION._type);
    });

    // Check that the schema is correct
    expect(deviceConfiguration).toMatchGraphObjectSchema({
      _class: entities.DEVICE_CONFIGURATION._class,
    });
  });
});