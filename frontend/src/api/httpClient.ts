/*type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

const BASE_URL = "http://localhost:5000";

const buildHeaders = (customHeaders: Record<string, string> = {}) => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
};

const buildBody = (method: RequestMethod, body?: unknown): string | undefined => {
  return body && method !== "GET" ? JSON.stringify(body) : undefined;
};

const handleErrors = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {}
    throw { status: response.status, data: errorData };
  }
  return response.json() as Promise<T>;
};

export const httpClient = async <T>(
  endpoint: string,
  options: RequestOptions
): Promise<T> => {
  const { method = "GET", body, headers } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: buildHeaders(headers),
    body: buildBody(method, body),
  });

  return handleErrors<T>(response);
};
*/

// Eliminamos RequestMethod y RequestOptions manuales
// Usamos RequestInit, que es la interfaz estándar de fetch

export const httpClient = async <T>(
  url: string,
  options?: RequestInit // Ya incluye method, headers, body, etc.
): Promise<T> => {
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw { status: response.status, data: errorData };
  }

  return response.json() as Promise<T>;
};
