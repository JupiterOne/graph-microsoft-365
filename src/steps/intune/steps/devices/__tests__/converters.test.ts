import { DeviceType } from '@microsoft/microsoft-graph-types-beta';
import { normalizeMacAddress, selectDeviceType } from '../converters';

describe('selectDeviceType', () => {
  test('if a device is not physical, it should be typed as a server', () => {
    const testTypes: DeviceType[] = ['linux', 'unix', 'windowsPhone', 'iPod'];
    testTypes.forEach((type) => {
      expect(selectDeviceType(type, false)).toBe('server');
    });
  });

  test('physical linux and unix machines should be "desktops"', () => {
    const testTypes: DeviceType[] = ['linux', 'unix'];
    testTypes.forEach((type) => {
      expect(selectDeviceType(type, true)).toBe('desktop');
    });
  });

  test('windowsRT device type should be a user_endpoint', () => {
    expect(selectDeviceType('windowsRT', true)).toBe('user_endpoint');
  });
});

describe('#normalizeMacAddress', () => {
  test('macAddress is normalized', () => {
    const macAddress = '001122AABBCC';
    const expected = '00:11:22:aa:bb:cc';
    expect(normalizeMacAddress(macAddress)).toBe(expected);
  });
  test('lowercases macAddress that are not length 12', () => {
    const macAddress = '00:11:22:AA:BB:CC';
    const expected = '00:11:22:aa:bb:cc';
    expect(normalizeMacAddress(macAddress)).toBe(expected);
  });
});
