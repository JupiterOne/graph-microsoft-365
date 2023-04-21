export function isRetryable(err: any): boolean {
  // -1 a `FetchError` (probably connection timeout)
  // 200 OK, on the logs sometimes we get 200 'FetchError' when the response timesout.
  // 400 Bad Request
  // 408 Request Timeout
  // 500 InternalSeverError
  // 502 BadGateway, although we have seen this status code with statusText: UnknownError
  // 503 ServiceUnavailable, haven't seen this error but is retryable
  // 504 GatewayTimeout
  // Others we could consider adding if necessary: 408, 503 and others
  const isRetryableStatusCode = (statusCode: number): boolean => {
    return [-1, 200, 400, 408, 500, 502, 503, 504].includes(statusCode);
  };

  const isRetryableErrorMessage = (message: string): boolean => {
    return ['CompactToken parsing failed with error code: 80049217'].includes(
      message,
    );
  };

  return (
    isRetryableStatusCode(err.statusCode) ||
    isRetryableErrorMessage(err.message)
  );
}

export function retriesAvailable(retries: number): boolean {
  return retries < 5;
}
