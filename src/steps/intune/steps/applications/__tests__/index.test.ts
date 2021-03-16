import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupAzureRecording } from '../../../../../../test/recording';
import { config } from '../../../../../../test/config';
import { fetchDevices } from '../../devices';
import { entities } from '../../../constants';
import { toArray } from '../../../../../utils/toArray';
import { fetchDetectedApplications, fetchManagedApplications } from '..';
import { groupBy, sortBy, last, uniq } from 'lodash';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetchManagedApplications', () => {
  it('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchManagedApplications',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchDevices(context);
    await fetchManagedApplications(context);

    const nonHostOrHostAgentEntities = context.jobState.collectedEntities.filter(
      (e) =>
        !toArray(e._class).includes('HostAgent') &&
        !toArray(e._class).includes('Host'),
    );
    const deviceApplicationRelationships = context.jobState.collectedRelationships.filter(
      (r) => r._type.includes(entities.MANAGED_APPLICATION._type),
    );

    // Check that we have no entities
    expect(nonHostOrHostAgentEntities.length).toBe(0);

    // Check that we have DEVICE_ASSIGNED_MANAGED_APPLICATION relationships
    expect(deviceApplicationRelationships.length).toBeGreaterThan(0);
    deviceApplicationRelationships.forEach((r) =>
      expect(r).toMatchObject({
        _mapping: expect.any(Object),
      }),
    );
    expect(deviceApplicationRelationships).toMatchSnapshot(
      'deviceManagedApplicationRelationships',
    );
  });
});

describe('fetchDetectedApplications', () => {
  it('should make entities and relationships correctly', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'fetchDetectedApplications',
    });
    const context = createMockStepExecutionContext({ instanceConfig: config });

    await fetchDevices(context);
    await fetchDetectedApplications(context);

    const nonHostOrHostAgentEntities = context.jobState.collectedEntities.filter(
      (e) =>
        !toArray(e._class).includes('HostAgent') &&
        !toArray(e._class).includes('Host'),
    );
    const deviceApplicationRelationships = context.jobState.collectedRelationships.filter(
      (r) => r._type.includes(entities.DETECTED_APPLICATION._type),
    );

    // Check that we have no entities
    expect(nonHostOrHostAgentEntities.length).toBe(0);

    // Check that we have DEVICE_ASSIGNED_MANAGED_APPLICATION relationships
    expect(deviceApplicationRelationships.length).toBeGreaterThan(0);
    deviceApplicationRelationships.forEach((r) =>
      expect(r).toMatchObject({
        _mapping: expect.any(Object),
      }),
    );
    expect(deviceApplicationRelationships).toMatchSnapshot(
      'deviceDetecctedApplicationRelationships',
    );

    // Check that you can have multiple relationships with the same application based on version
    const groupedRelationships = groupBy(
      deviceApplicationRelationships,
      '_mapping.targetEntity.name',
    );
    const appWithMultipleVersions = last(
      sortBy(groupedRelationships),
      (c) => c.length,
    );
    expect(appWithMultipleVersions.length).toBeGreaterThan(1);
    // Check that all versions are unique
    const versions = appWithMultipleVersions.map((app) => app.version);
    expect(versions.length).toBeGreaterThan(0);
    expect(versions.length).toEqual(uniq(versions).length);
  });
});
