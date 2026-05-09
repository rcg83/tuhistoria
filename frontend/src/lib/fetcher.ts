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
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
};
