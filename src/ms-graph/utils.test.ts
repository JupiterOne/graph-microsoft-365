import { isRetryable, retriesAvailable } from './utils';

describe('#isRetryable', () => {
  test('will retry -1 Fetch Error', () => {
    const err = new Error();
    Object.assign(err, {
      statusCode: -1,
      statusText: 'FetchError',
    });
    expect(isRetryable(err)).toBe(true);
  });

  test('will retry 400 Errors', () => {
    const err = new Error();

    Object.assign(err, {
      statusCode: 400,
    });
    expect(isRetryable(err)).toBe(true);
  });

  test('will retry 408 errors', () => {
    const err = new Error();

    Object.assign(err, {
      statusCode: 408,
    });
    expect(isRetryable(err)).toBe(true);
  });

  test('will retry 500 errors', () => {
    const err = new Error();

    Object.assign(err, {
      statusCode: 500,
    });
    expect(isRetryable(err)).toBe(true);
  });

  test('will retry 502 errors', () => {
    const err = new Error();

    Object.assign(err, {
      statusCode: 502,
    });

    expect(isRetryable(err)).toBe(true);
  });

  test('will retry 503 errors', () => {
    const err = new Error();
    Object.assign(err, {
      statusCode: 503,
    });
    expect(isRetryable(err)).toBe(true);
  });

  test('will retry 504 erorrs', () => {
    const err = new Error();
    Object.assign(err, {
      statusCode: 504,
    });
    expect(isRetryable(err)).toBe(true);
  });

  test('will retry compact token error', () => {
    const err = new Error(
      'CompactToken parsing failed with error code: 80049217',
    );

    expect(isRetryable(err)).toBe(true);
  });

  test('will not retry if already retried 5 times', () => {
    expect(retriesAvailable(5)).toBe(false);
  });
});
