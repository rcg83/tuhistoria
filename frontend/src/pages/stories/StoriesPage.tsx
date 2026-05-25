import { useAuth } from 'src/features/auth/context/AuthContext';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import { useStories } from 'src/features/stories/context/StoriesContext';
import { StoryCard } from 'src/features/stories/components/StoryCard';
import './StoriesPage.scss';

export const StoriesPage = () => {
  const { user } = useAuth();
  const { stories, selected, selectStory, error, starting, startStory } = useStories();

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
                {stories.length === 0 && <p className="story-list--empty">Cargando...</p>}
                {stories.map((s) => (
                  <StoryCard
                    key={s._id}
                    story={s}
                    isActive={selected?._id === s._id}
                    onClick={() => selectStory(s)}
                  />
                ))}
              </div>
            )}
          </div>
        }
        rightPage={
          <div className="stories-content">
            {selected ? (
              <>
                <h1>{selected.template.title}</h1>
                <p className="stories-content__desc">{selected.template.description}</p>
                <p className="stories-content__text">{selected.template.initialText}</p>
                {selected.messages.length === 0 && (
                  <button
                    className="stories-content__start-btn"
                    onClick={() => startStory(selected.template._id)}
                    disabled={starting}
                  >
                    {starting ? 'Iniciando...' : 'Comenzar esta historia'}
                  </button>
                )}
              </>
            ) : (
              <>
                <h1>Bienvenido, {user?.username}</h1>
                <p>Selecciona una historia desde el menú.</p>
              </>
            )}
          </div>
        }
      />
    </div>
  );
};
