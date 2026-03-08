/**
 * API client helper with BYOK (Bring Your Own Key) pattern.
 *
 * Designed for extensions that let users provide their own API keys
 * (OpenAI, Claude, etc.) so you don't need a backend proxy.
 *
 * Usage:
 *   const client = createApiClient({
 *     baseUrl: 'https://api.anthropic.com',
 *     getApiKey: () => storage.get<string>('apiKey'),
 *     headers: { 'anthropic-version': '2023-06-01' },
 *   });
 *
 *   const response = await client.post('/v1/messages', {
 *     model: 'claude-haiku-4-5-20251001',
 *     max_tokens: 1024,
 *     messages: [{ role: 'user', content: 'Hello!' }],
 *   });
 */

interface ApiClientConfig {
  baseUrl: string;
  getApiKey: () => Promise<string | undefined>;
  headers?: Record<string, string>;
  authHeader?: string; // default: 'x-api-key', use 'Authorization' for Bearer tokens
  authPrefix?: string; // default: '' for x-api-key, 'Bearer ' for Authorization
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export function createApiClient(config: ApiClientConfig) {
  const {
    baseUrl,
    getApiKey,
    headers: defaultHeaders = {},
    authHeader = 'x-api-key',
    authPrefix = '',
  } = config;

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    const apiKey = await getApiKey();
    if (!apiKey) {
      return { data: null, error: 'No API key configured', status: 0 };
    }

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          [authHeader]: `${authPrefix}${apiKey}`,
          ...defaultHeaders,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return { data: null, error: errorBody, status: response.status };
      }

      const data = (await response.json()) as T;
      return { data, error: null, status: response.status };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Network error',
        status: 0,
      };
    }
  }

  return {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
    put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
    patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
    delete: <T>(path: string) => request<T>('DELETE', path),
  };
}
