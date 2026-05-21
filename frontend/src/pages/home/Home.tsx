import { useState, useEffect } from 'react';
import { useAuth } from 'src/features/auth/context/AuthContext';
import { BookWrapper } from 'src/components/bookWrapper/BookWrapper';
import { fetcher } from 'src/lib/fetcher';
import './Home.scss';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Story {
  _id: string;
  template: {
    _id: string;
    title: string;
    description: string;
    initialText: string;
    imageUrl: string;
  };
  messages: { role: string; text: string; timestamp: string }[];
}

export const Home = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [selected, setSelected] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay sesión activa');
      return;
    }
    fetcher<Story[]>(`${API_URL}/api/stories/my-stories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((data) => {
        setStories(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Error al cargar historias');
      });
  }, []);

  return (
    <BookWrapper
      leftPage={
        <div className="home-sidebar">
          <h2>Mis Historias</h2>
          {error ? (
            <p className="story-list--error">{error}</p>
          ) : (
            <ul className="story-list">
              {stories.length === 0 && <p className="story-list--empty">Cargando...</p>}
              {stories.map((s) => (
                <li
                  key={s._id}
                  className={`story-list__item ${selected?._id === s._id ? 'story-list__item--active' : ''}`}
                  onClick={() => setSelected(s)}
                >
                  {s.template.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      }
      rightPage={
        <div className="home-content">
          {selected ? (
            <>
              <h1>{selected.template.title}</h1>
              <p className="home-content__desc">{selected.template.description}</p>
              <p className="home-content__text">{selected.template.initialText}</p>
            </>
          ) : (
            <>
              <h1>Bienvenido, {user?.username}</h1>
              <p>Selecciona una historia para continuar.</p>
            </>
          )}
        </div>
      }
    />
  );
};
