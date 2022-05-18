export function isRetryable(
  err: any,
  nextLink: string,
  retries: number,
): boolean {
  const retryableErrorMessages = [
    'CompactToken parsing failed with error code: 80049217',
  ];
  // we can retry
  // -1 a `FetchError` (probably connection timeout)
  // 500 InternalSeverError
  // 502 BadGateway, although we have seen this status code with statusText: UnknownError
  // Others we could consider adding if necessary: 408, 503 and others
  const retryableStatusCodes = [-1, 408, 500, 502];

  // A FetchError is a connection timeout that we should retry
  // retryable can be type boolean, "", or undefined
  return (
    retries < 5 &&
    !!nextLink &&
    (retryableErrorMessages.includes(err.message) ||
      retryableStatusCodes.includes(err.statusCode))
  );
}
