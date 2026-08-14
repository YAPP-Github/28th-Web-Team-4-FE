import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';
import { refreshAuthSession } from '@/app/api-routes/auth/session-refresh';
import {
  forbiddenMutationResponse,
  isTrustedMutation,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';
import type { AuthSession } from '@/shared/lib/auth/session';

const ACCESS_TOKEN_EXPIRY_SKEW_MS = 30_000;
const API_PATH_PREFIX = ['api', 'v1'] as const;
const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD']);
const MUTATION_METHODS = new Set(['DELETE', 'PATCH', 'POST', 'PUT']);
const REQUEST_HEADERS_TO_FORWARD = [
  'accept',
  'content-type',
  'if-modified-since',
  'if-none-match',
  'range',
] as const;
const RESPONSE_HEADERS_TO_FORWARD = [
  'cache-control',
  'content-disposition',
  'content-range',
  'content-type',
  'etag',
  'last-modified',
] as const;

type BackendProxyContext = {
  params: Promise<{ path: string[] }>;
};

type ActiveSessionResult = {
  didRefresh: boolean;
  session: AuthSession | null;
};

function getBackendBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL must be set at runtime.');
  }

  return baseUrl.replace(/\/$/, '');
}

function createBackendUrl(path: readonly string[], search: string): URL | null {
  if (
    path.length < API_PATH_PREFIX.length ||
    path[0] !== API_PATH_PREFIX[0] ||
    path[1] !== API_PATH_PREFIX[1]
  ) {
    return null;
  }

  if (path.some((segment) => segment === '.' || segment === '..')) {
    return null;
  }

  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join('/');
  const url = new URL(`${getBackendBaseUrl()}/${encodedPath}`);
  url.search = search;

  return url;
}

function createUpstreamHeaders(request: Request, accessToken?: string): Headers {
  const headers = new Headers();

  for (const name of REQUEST_HEADERS_TO_FORWARD) {
    const value = request.headers.get(name);

    if (value) {
      headers.set(name, value);
    }
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
}

async function readRequestBody(request: Request): Promise<ArrayBuffer | undefined> {
  if (METHODS_WITHOUT_BODY.has(request.method) || !request.body) {
    return undefined;
  }

  const body = await request.arrayBuffer();

  return body.byteLength > 0 ? body : undefined;
}

async function requestBackend(
  request: Request,
  url: URL,
  accessToken: string | undefined,
  body: ArrayBuffer | undefined,
): Promise<Response> {
  return fetch(url, {
    method: request.method,
    headers: createUpstreamHeaders(request, accessToken),
    ...(body ? { body } : {}),
    cache: 'no-store',
  });
}

function createClientResponse(response: Response): Response {
  const headers = new Headers();

  for (const name of RESPONSE_HEADERS_TO_FORWARD) {
    const value = response.headers.get(name);

    if (value) {
      headers.set(name, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function getActiveSession(): Promise<ActiveSessionResult> {
  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    if (session) {
      await clearAuthSession();
    }

    return { didRefresh: false, session: null };
  }

  if (session.accessTokenExpiresAt > Date.now() + ACCESS_TOKEN_EXPIRY_SKEW_MS) {
    return { didRefresh: false, session };
  }

  const refreshed = await refreshAuthSession(session);

  if ('error' in refreshed) {
    await clearAuthSession();
    return { didRefresh: true, session: null };
  }

  return { didRefresh: true, session: refreshed.session };
}

export async function proxyBackendRequest(
  request: Request,
  context: BackendProxyContext,
): Promise<Response> {
  if (MUTATION_METHODS.has(request.method) && !isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const { path } = await context.params;
  const url = createBackendUrl(path, new URL(request.url).search);

  if (!url) {
    return new Response(null, { status: 404 });
  }

  let activeSession: ActiveSessionResult;

  try {
    activeSession = await getActiveSession();
  } catch (error) {
    return upstreamErrorResponse(error);
  }

  let body: ArrayBuffer | undefined;

  try {
    body = await readRequestBody(request);
  } catch (error) {
    return upstreamErrorResponse(error, 400);
  }

  let response: Response;

  try {
    response = await requestBackend(request, url, activeSession.session?.accessToken, body);
  } catch (error) {
    return upstreamErrorResponse(error);
  }

  if (response.status === 401 && activeSession.session && !activeSession.didRefresh) {
    const refreshed = await refreshAuthSession(activeSession.session);

    if ('error' in refreshed) {
      await clearAuthSession();
    } else {
      try {
        response = await requestBackend(request, url, refreshed.session.accessToken, body);
      } catch (error) {
        return upstreamErrorResponse(error);
      }
    }
  }

  return createClientResponse(response);
}
