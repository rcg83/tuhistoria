import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import { StoryCard } from 'src/features/stories/components/StoryCard';
import { StoryButton } from 'src/components/buttons/StoryButton';
import { fetcher } from 'src/lib/fetcher';
import type { Story } from 'src/features/stories/context/StoriesContext';
import './MyStoriesPage.scss';

const API_URL = import.meta.env.VITE_API_URL;

export const MyStoriesPage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay sesión activa');
      setLoading(false);
      return;
    }
    fetcher<Story[]>(`${API_URL}/api/stories/my-stories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setStories(data);
        if (data.length > 0) setSelectedId(data[0]._id);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Error al cargar tus historias');
      })
      .finally(() => setLoading(false));
  }, []);

  const selected = stories.find((s) => s._id === selectedId) || null;

  return (
    <div className="my-stories-page">
      <BookWrapper
        leftPage={
          <div className="my-stories-sidebar">
            <h2>Mis historias</h2>
            {loading ? (
              <p>Cargando tus historias...</p>
            ) : (
              <div className="my-stories-sidebar__scroll">
                {error && <p className="my-stories-list--error">{error}</p>}
                <div className="my-stories-list">
                  {stories.map((s) => (
                    <StoryCard
                      key={s._id}
                      story={s}
                      isActive={selectedId === s._id}
                      onClick={() => setSelectedId(s._id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        rightPage={
          loading ? null : stories.length === 0 ? (
            <div className="my-stories-content my-stories-content--empty">
              <h1>Mis historias</h1>
              <p>Aún no has empezado ninguna historia.</p>
              <Link to="/stories" className="my-stories-page__browse-btn">
                Explorar historias
              </Link>
            </div>
          ) : (
            <div className="my-stories-content">
              {selected && (
                <>
                  <h1>{selected.template.title}</h1>
                  <p className="my-stories-content__desc">{selected.template.description}</p>
                  <p className="my-stories-content__meta">
                    {selected.createdAt && (
                      <span>Creada el {new Date(selected.createdAt).toLocaleDateString('es-ES')}</span>
                    )}
                    <span>{selected.messages.length} mensajes</span>
                  </p>
                  {selected.messages.length > 0 && (
                    <div className="my-stories-content__preview">
                      <p className="my-stories-content__preview-label">Último mensaje:</p>
                      <p className="my-stories-content__preview-text">
                        {selected.messages[selected.messages.length - 1].text}
                      </p>
                    </div>
                  )}
                  <StoryButton onClick={() => navigate(`/story/${selected._id}`)}>
                    Continuar historia
                  </StoryButton>
                </>
              )}
            </div>
          )
        }
      />
    </div>
  );
};
