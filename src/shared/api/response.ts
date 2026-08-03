type JsonObject = Record<string, unknown>;

class ApiResponseError extends Error {
  readonly body: unknown;
  readonly error?: unknown;
  readonly status: number;
  readonly statusText: string;

  constructor(response: Response, body: unknown) {
    super(`HTTP ${response.status} ${response.statusText}`.trim());
    this.name = 'ApiResponseError';

    if (isJsonObject(body) && 'error' in body) {
      this.error = body.error;
    }

    this.body = body;
    this.status = response.status;
    this.statusText = response.statusText;
  }
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function createResponseError(response: Response, body: unknown): ApiResponseError {
  return new ApiResponseError(response, body);
}

async function getResponseError(response: Response): Promise<ApiResponseError> {
  return createResponseError(response, await parseJsonSafely(response));
}

export async function ensureResponseOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw await getResponseError(response);
  }
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await getResponseError(response);
  }

  const body = await parseJsonSafely(response);

  if (body === undefined) {
    throw createResponseError(response, body);
  }

  return body as T;
}
