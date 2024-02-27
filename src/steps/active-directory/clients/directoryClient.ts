import { DirectoryObject, Group, User } from '@microsoft/microsoft-graph-types';

import { GraphClient } from '../../../ms-graph/client';

export enum MemberType {
  USER = '#microsoft.graph.user',
  GROUP = '#microsoft.graph.group',
}

/**
 * A type tracking the selected data answered by a request for group members.
 * The properties are those requested. Additional properties should be added
 * here and in `iterateGroupMembers` to communicate what we're requesting.
 */
export interface GroupMember extends DirectoryObject {
  '@odata.type': string;
  displayName?: string;
  mail?: string | null;
  jobTitle?: string | null;
}

export class DirectoryGraphClient extends GraphClient {
  // https://docs.microsoft.com/en-us/graph/api/group-list?view=graph-rest-1.0&tabs=http
  public async iterateGroups(
    callback: (user: Group) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: '/groups',
      query: { $top: '999' },
      callback,
    });
  }

  // https://docs.microsoft.com/en-us/graph/api/group-list-members?view=graph-rest-1.0&tabs=http
  public async iterateGroupMembers(
    input: {
      groupId: string;
    },
    callback: (user: GroupMember) => void | Promise<void>,
  ): Promise<void> {
    return this.iterateResources({
      resourceUrl: `/groups/${input.groupId}/members`,
      query: { $top: '999' },
      callback,
    });
  }

  // https://docs.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http
  public async iterateUsers(
    callback: (user: User) => void | Promise<void>,
  ): Promise<void> {
    const defaultSelect = [
      'businessPhones',
      'displayName',
      'givenName',
      'jobTitle',
      'mail',
      'mobilePhone',
      'officeLocation',
      'preferredLanguage',
      'surname',
      'userPrincipalName',
      'id',
      'userType',
      'accountEnabled',
      'usageLocation',
      'signInActivity',
    ];
    // The ingestion of 'signInActivity' requires a special permission
    // If the don't provide it, dont block the entire step.
    // Just fetch without that property
    try {
      await this.callApi({
        link: '/users',
        query: { $top: '1', $select: defaultSelect.toString() },
      });
    } catch (error) {
      if (
        error.message ==
          'Calling principal does not have required MSGraph permissions AuditLog.Read.All' ||
        error.message ==
          "Neither tenant is B2C or tenant doesn't have premium license"
      ) {
        defaultSelect.splice(defaultSelect.indexOf('signInActivity'), 1);
      } else {
        throw error;
      }
    }
    return this.iterateResources({
      resourceUrl: '/users',
      query: { $top: '999', $select: defaultSelect.toString() },
      callback,
    });
  }
}
