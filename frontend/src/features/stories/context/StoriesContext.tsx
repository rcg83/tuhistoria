import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetcher } from 'src/lib/fetcher';

const API_URL = import.meta.env.VITE_API_URL;

export interface Story {
  _id: string;
  template: {
    _id: string;
    title: string;
    description: string;
    initialText: string;
    imageUrl: string;
  };
  messages: { role: string; text: string; timestamp: string }[];
  createdAt?: string;
}

interface StoriesContextValue {
  stories: Story[];
  selected: Story | null;
  selectStory: (story: Story | null) => void;
  error: string | null;
  starting: boolean;
  startStory: (templateId: string) => Promise<void>;
}

const StoriesContext = createContext<StoriesContextValue | null>(null);

export const StoriesProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [selected, setSelected] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const fetchStories = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay sesión activa');
      return;
    }
    try {
      const data = await fetcher<Story[]>(`${API_URL}/api/stories/my-stories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(data);
      return data;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error al cargar historias');
      return [];
    }
  }, []);

  useEffect(() => {
    fetchStories().then((data) => {
      if (data && data.length > 0) setSelected(data[0]);
    });
  }, [fetchStories]);

  const startStory = async (templateId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setStarting(true);
    try {
      const result = await fetcher<{ storyInstanceId: string }>(
        `${API_URL}/api/stories/start`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ templateId }),
        }
      );

      const data = await fetchStories();
      const newStory = data?.find((s) => s._id === result.storyInstanceId);
      if (newStory) setSelected(newStory);

      navigate(`/story/${result.storyInstanceId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setStarting(false);
    }
  };

  return (
    <StoriesContext.Provider
      value={{ stories, selected, selectStory: setSelected, error, starting, startStory }}
    >
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => {
  const ctx = useContext(StoriesContext);
  if (!ctx) throw new Error('useStories must be used within StoriesProvider');
  return ctx;
};
