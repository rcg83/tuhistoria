export const fetcher = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body.message || body.error || '';
    } catch {
      /* ignore parse errors */
    }
    throw new Error(detail || `Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
};
