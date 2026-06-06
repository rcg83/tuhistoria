import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/features/auth/context/AuthContext';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import { StoryCard } from 'src/features/stories/components/StoryCard';
import { StoryButton } from 'src/components/buttons/StoryButton';
import { fetcher } from 'src/lib/fetcher';
import { useDebouncedLoading } from 'src/hooks/useDebouncedLoading';
import type { Story } from 'src/features/stories/context/StoriesContext';
import './StoriesPage.scss';

const API_URL = import.meta.env.VITE_API_URL;

interface Template {
  _id: string;
  title: string;
  description: string;
  initialText: string;
  imageUrl?: string;
}

export const StoriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const showLoading = useDebouncedLoading(loading, 2000);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay sesión activa');
      return;
    }
    fetcher<Template[]>(`${API_URL}/api/stories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setTemplates(data);
        if (data.length > 0) setSelectedId(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Error al cargar historias');
      })
      .finally(() => setLoading(false));
  }, []);

  const selected = templates.find((t) => t._id === selectedId) || null;

  const handleStart = async (templateId: string) => {
    const t = templates.find(t => t._id === templateId);
    if (!t) return;
    setStarting(true);
    try {
      const data = await fetcher<{ storyInstanceId: string }>(`${API_URL}/api/stories/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ templateId }),
      });
      navigate(`/story/${data.storyInstanceId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setStarting(false);
    }
  };

  const asStory = (t: Template): Story => ({
    _id: t._id,
    template: { ...t, _id: t._id, imageUrl: t.imageUrl || '' },
    messages: [],
  });

  return (
    <div className="stories-page">
      <BookWrapper
        leftPage={
          <div className="stories-sidebar">
            <h2>Historias</h2>
            {error ? (
              <p className="story-list--error">{error}</p>
            ) : (
              <div className="story-list">
                {showLoading && <p className="story-list--empty">Cargando...</p>}
                {!loading && templates.length === 0 && !error && <p className="story-list--empty">No hay historias disponibles.</p>}
                {templates.map((t) => (
                  <StoryCard
                    key={t._id}
                    story={asStory(t)}
                    isActive={selectedId === t._id}
                    onClick={() => setSelectedId(t._id)}
                  />
                ))}
              </div>
            )}
          </div>
        }
        rightPage={
          <div className="stories-content">
            <div className="stories-content__mobile-list">
              <h2>Historias</h2>
              {error ? (
                <p className="story-list--error">{error}</p>
              ) : (
                <div className="story-list">
                  {showLoading && <p className="story-list--empty">Cargando...</p>}
                  {!loading && templates.length === 0 && !error && <p className="story-list--empty">No hay historias disponibles.</p>}
                  {templates.map((t) => (
                    <StoryCard
                      key={t._id}
                      story={asStory(t)}
                      isActive={selectedId === t._id}
                      onClick={() => setSelectedId(t._id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="stories-content__detail">
              {selected ? (
                <>
                  <h1>{selected.title}</h1>
                  <p className="stories-content__desc">{selected.description}</p>
                  <p className="stories-content__text">{selected.initialText}</p>
                  <StoryButton
                    onClick={() => handleStart(selected._id)}
                    disabled={starting}
                  >
                    {starting ? 'Iniciando...' : 'Comenzar esta historia'}
                  </StoryButton>
                </>
              ) : (
                <>
                  <h1>Bienvenido, {user?.username}</h1>
                  <p>Selecciona una historia desde el menú.</p>
                </>
              )}
            </div>
          </div>
        }
      />
    {selected && (
      <div className="stories-modal" onClick={() => setSelectedId(null)}>
        <div className="stories-modal__content" onClick={(e) => e.stopPropagation()}>
          <button
            className="stories-modal__close"
            onClick={() => setSelectedId(null)}
            aria-label="Cerrar"
          >
            &times;
          </button>
          <h1>{selected.title}</h1>
          <p className="stories-content__desc">{selected.description}</p>
          <p className="stories-content__text">{selected.initialText}</p>
          <StoryButton
            onClick={() => handleStart(selected._id)}
            disabled={starting}
          >
            {starting ? 'Iniciando...' : 'Comenzar esta historia'}
          </StoryButton>
        </div>
      </div>
    )}
  </div>
  );
};
