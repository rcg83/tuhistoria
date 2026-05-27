import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import { useStories, type Story } from 'src/features/stories/context/StoriesContext';
import { fetcher } from 'src/lib/fetcher';
import './StoryPage.scss';

const API_URL = import.meta.env.VITE_API_URL;

interface Message {
  role: string;
  text: string;
  timestamp: string;
}

export const StoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { stories } = useStories();
  const [story, setStory] = useState<Story | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fromContext = stories.find(s => s._id === id);
    if (fromContext) {
      setStory(fromContext);
      setMessages(fromContext.messages);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetcher<Story>(`${API_URL}/api/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(data => {
        setStory(data);
        setMessages(data.messages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, stories]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending || !id) return;

    const userMsg: Message = {
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSendError(null);
    setSending(true);

    try {
      const token = localStorage.getItem('token');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const data = await fetcher<{ response: string }>(
        `${API_URL}/api/stories/${id}/chat`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userInput: text }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      const aiMsg: Message = {
        role: 'model',
        text: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al enviar el mensaje';
      setSendError(msg);
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="story-page">
        <p className="story-page__loading">Cargando historia...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="story-page">
        <p className="story-page__error">Historia no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="story-page">
      <BookWrapper
        leftPage={
          <div className="story-page__history">
            <h1 className="story-page__title">{story.template.title}</h1>
            <p className="story-page__desc">{story.template.description}</p>
            <p className="story-page__initial">{story.template.initialText}</p>
          </div>
        }
        rightPage={
          <div className="story-page__write">
            <div className="story-page__messages">
              {messages.map((msg, i) => (
                <p
                  key={i}
                  className={`story-page__msg story-page__msg--${msg.role}`}
                >
                  <span className="story-page__label">
                    {msg.role === 'user' ? 'Tú' : 'Narrador'}
                  </span>
                  {msg.text}
                </p>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {sendError && (
              <p className="story-page__error-msg">{sendError}</p>
            )}
            <div className="story-page__input-area">
              <textarea
                className="story-page__input"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
                rows={4}
              />
              <button
                className="story-page__send"
                onClick={handleSend}
                disabled={sending || !input.trim()}
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};
