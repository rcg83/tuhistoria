type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
    method: RequestMethod;
    body?: any;
    headers?: Record<string, string>
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

const buildBody = (method: string, body?: any) => {
  return body && method !== "GET" ? JSON.stringify(body) : undefined;
};

const handleErrors = async (response: Response) => {
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {}
    throw { status: response.status, data: errorData };
  }
  return response.json();
};

export const httpClient = async (endpoint: string, options: RequestOptions) => {
  const { method = "GET", body, headers } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: buildHeaders(headers),
    body: buildBody(method, body),
  });

  return handleErrors(response);
};