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
    const errorData = await response.json().catch(() => ({}));
    throw { status: response.status, data: errorData };
  }

  return response.json() as Promise<T>;
};
