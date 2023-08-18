import {
  Recording,
  RecordingEntry,
  setupRecording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupAzureRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    mutateEntry: mutateRecordingEntry,
  });
}

function mutateRecordingEntry(entry: RecordingEntry): void {
  mutations.unzipGzippedRecordingEntry(entry);

  const responseText = entry.response.content.text;
  if (!responseText) {
    return;
  }

  const responseJson = JSON.parse(responseText);

  const DEFAULT_REDACT = '[REDACTED]';
  const keysToRedactMap = new Map();
  keysToRedactMap.set('serialNumber', DEFAULT_REDACT);
  keysToRedactMap.set('deviceName', DEFAULT_REDACT);
  keysToRedactMap.set('emailAddress', 'redacted@email.com');
  keysToRedactMap.set('userPrincipalName', DEFAULT_REDACT);
  keysToRedactMap.set('imei', DEFAULT_REDACT);
  keysToRedactMap.set('phoneNumber', DEFAULT_REDACT);
  keysToRedactMap.set('wiFiMacAddress', DEFAULT_REDACT);
  keysToRedactMap.set('meid', DEFAULT_REDACT);
  keysToRedactMap.set('managedDeviceName', DEFAULT_REDACT);
  keysToRedactMap.set('userName', DEFAULT_REDACT);
  keysToRedactMap.set('deviceDisplayName', DEFAULT_REDACT);
  keysToRedactMap.set('hardwareSerial', DEFAULT_REDACT);

  if (responseJson?.value?.forEach) {
    responseJson.value.forEach((responseValue: string, index: number) => {
      keysToRedactMap.forEach((redactionValue: string, keyToRedact: string) => {
        if (responseValue[keyToRedact]) {
          responseJson.value[index][keyToRedact] = redactionValue;
        }
      });
    });
    entry.response.content.text = JSON.stringify(responseJson);
  }

  if (/login/.exec(entry.request.url) && entry.request.postData) {
    // Redact request body with secrets for authentication
    entry.request.postData.text = '[REDACTED]';

    // Redact authentication response token
    if (responseJson.access_token) {
      entry.response.content.text = JSON.stringify(
        {
          ...responseJson,
          access_token: '[REDACTED]',
        },
        null,
        0,
      );
    }
  }
}
