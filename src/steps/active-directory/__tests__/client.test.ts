import {
  createMockIntegrationLogger,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import {
  DirectoryObject,
  DirectoryRole,
  User,
} from '@microsoft/microsoft-graph-types';

import {
  config,
  insufficientPermissionsDirectoryConfig,
} from '../../../../test/config';
import { setupAzureRecording } from '../../../../test/recording';
import { DirectoryGraphClient, GroupMember } from '../clients/directoryClient';

const logger = createMockIntegrationLogger();

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('iterateGroupMembers', () => {
  let client: DirectoryGraphClient;

  beforeEach(() => {
    client = new DirectoryGraphClient(logger, config);
  });

  test('iterateGroupMembers', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'iterateGroupMembers',
    });

    const resources: GroupMember[] = [];
    await client.iterateGroupMembers(
      { groupId: '58e48aba-cd45-440f-a851-2bf9715fadc1' },
      (e) => {
        resources.push(e);
      },
    );

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((r) => {
      expect(r).toMatchObject({
        displayName: expect.any(String),
      });
    });
  });
});

describe('iterateUsers', () => {
  test('404 answers empty collection', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'iterateUsers404',
    });

    const client = new DirectoryGraphClient(logger, config);

    recording.server
      .get('https://graph.microsoft.com/v1.0/users')
      .intercept((_req, res) => {
        res.status(404);
      });

    const resources: User[] = [];
    await client.iterateUsers((e) => {
      resources.push(e);
    });

    expect(resources.length).toEqual(0);
  });

  // TODO @zemberdotnet INT-5328 Reenable/rerecord test
  test.skip('provides expected data', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'iterateUsers',
    });

    const client = new DirectoryGraphClient(logger, config);

    const resources: User[] = [];
    await client.iterateUsers((e) => {
      resources.push(e);
    });

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((r) => {
      expect(r).toMatchObject({
        id: expect.any(String),
      });
    });
  });
});

describe('iterateDirectoryRoles', () => {
  test('accessible', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'iterateDirectoryRoles',
    });

    const client = new DirectoryGraphClient(logger, config);

    const resources: DirectoryRole[] = [];
    await client.iterateDirectoryRoles((e) => {
      resources.push(e);
    });

    expect(resources.length).toBeGreaterThan(0);
    resources.forEach((r) => {
      expect(r).toMatchObject({
        roleTemplateId: expect.any(String),
      });
    });
  });

  test('insufficient permissions', async () => {
    recording = setupAzureRecording({
      directory: __dirname,
      name: 'iterateDirectoryRolesInsufficientPermissions',
      options: { recordFailedRequests: true },
    });

    const client = new DirectoryGraphClient(
      logger,
      insufficientPermissionsDirectoryConfig,
    );

    const resources: DirectoryRole[] = [];
    await client.iterateDirectoryRoles((e) => {
      resources.push(e);
    });

    expect(resources.length).toEqual(0);
  });
});

test('iterateDirectoryRoleMembers', async () => {
  recording = setupAzureRecording({
    directory: __dirname,
    name: 'iterateDirectoryRoleMembers',
  });

  const client = new DirectoryGraphClient(logger, config);

  const resources: DirectoryObject[] = [];
  await client.iterateDirectoryRoleMembers(
    '9a4ba32c-28dd-4c30-bc99-f8137845d6bf',
    (e) => {
      resources.push(e);
    },
  );

  expect(resources.length).toBeGreaterThan(0);
  resources.forEach((r) => {
    expect(r).toMatchObject({
      '@odata.type': '#microsoft.graph.user',
    });
  });
});
