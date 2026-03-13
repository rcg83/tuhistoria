export interface ApiStatus {
  message: string,
  version?: string;
}

const API_URL = 'http://localhost:5000';

const checkAPI = async (): Promise<ApiStatus> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Error en la API ${response.status}`);
  }

  return response.json();
}

export default checkAPI;