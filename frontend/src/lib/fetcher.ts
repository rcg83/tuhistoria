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
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }

    let detail = '';
    try {
      const body = await response.json();
      detail = body.message || body.error || '';
    } catch {}
    throw new Error(detail || `Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
};
