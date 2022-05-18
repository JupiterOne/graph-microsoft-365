import { isRetryable } from './utils';

describe('#isRetryable', () => {
  test('will retry -1 Fetch Error', () => {
    const err = new Error();
    Object.assign(err, {
      statusCode: -1,
      statusText: 'FetchError',
    });
    expect(isRetryable(err, 'dummy-link', 0)).toBe(true);
  });

  test('will retry 408 errors', () => {
    const err = new Error();

    Object.assign(err, {
      statusCode: 408,
    });
    expect(isRetryable(err, 'dummy-link', 0)).toBe(true);
  });

  test('will retry 500 errors', () => {
    const err = new Error();

    Object.assign(err, {
      statusCode: 500,
    });
    expect(isRetryable(err, 'dummy-link', 0)).toBe(true);
  });

  test('will retry 502 errors', () => {
    const err = new Error();

    Object.assign(err, {
      statusCode: 502,
    });

    expect(isRetryable(err, 'dummy-link', 0)).toBe(true);
  });

  test('will retry compact token error', () => {
    const err = new Error(
      'CompactToken parsing failed with error code: 80049217',
    );

    expect(isRetryable(err, 'dummy-link', 0)).toBe(true);
  });

  test('will not retry if next link is empty', () => {
    const err = new Error();

    // assign a retryable code
    Object.assign(err, {
      statusCode: 502,
    });

    // but nextLink is empty so we shouldn't retry
    expect(isRetryable(err, '', 0)).toBe(false);
  });

  test('will ot retry if already retried 5 times', () => {
    const err = new Error();
    // we have a retryable status code
    Object.assign(err, {
      statusCode: 502,
    });

    // but we've already retried 5 times so we shouldn't retry
    expect(isRetryable(err, '', 5)).toBe(false);
  });
});
