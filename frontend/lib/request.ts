const DEFAULT_API_BASE_URL = "http://localhost:4000";

type ApiEnvelope<TData> = {
  data?: TData;
  error?: string;
  issues?: Array<{ message?: string }>;
};

type ApiRequestInit<TBody> = Omit<RequestInit, "body"> & {
  body?: TBody;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function getApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (apiUrl) {
    const absoluteApiUrl = /^https?:\/\//i.test(apiUrl) ? apiUrl : `https://${apiUrl}`;

    return absoluteApiUrl.replace(/\/api\/?$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_URL must be set in production");
  }

  return DEFAULT_API_BASE_URL;
}

function getApiUrl(path: string) {
  const baseUrl = getApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

function getErrorMessage(result: unknown, fallback: string) {
  if (result && typeof result === "object") {
    const response = result as ApiEnvelope<unknown>;
    const issue = response.issues?.find((item) => item.message)?.message;

    return issue ?? response.error ?? fallback;
  }

  return fallback;
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestInit<TBody> = {}
): Promise<TResponse> {
  const { body, ...requestOptions } = options;
  const headers = new Headers(options.headers);
  const init: RequestInit = {
    ...requestOptions,
    headers
  };

  if (body !== undefined) {
    headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
    init.body = JSON.stringify(body);
  }

  const response = await fetch(getApiUrl(path), init);
  const result = (await response.json().catch(() => null)) as ApiEnvelope<TResponse> | TResponse | null;

  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(result, `Request failed with status ${response.status}`),
      response.status
    );
  }

  if (result && typeof result === "object" && "data" in result) {
    return (result as ApiEnvelope<TResponse>).data as TResponse;
  }

  return result as TResponse;
}
