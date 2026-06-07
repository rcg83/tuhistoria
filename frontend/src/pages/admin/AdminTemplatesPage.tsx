import { useState, useEffect, useCallback } from 'react';
import { fetcher } from 'src/lib/fetcher';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import { useDebouncedLoading } from 'src/hooks/useDebouncedLoading';
import { Button } from 'src/components/buttons/Button';
import './AdminTemplatesPage.scss';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_IMAGE = '/images/libro.png';

type EventItem = {
  messageNumber: number;
  prompt: string;
};

type Template = {
  _id: string;
  title: string;
  description: string;
  initialText: string;
  imageUrl?: string;
  events?: EventItem[];
};

const TemplateModal = ({
  editing,
  onClose,
  onSave,
}: {
  editing: Template | null;
  onClose: () => void;
  onSave: (data: { title: string; description: string; initialText: string; imageUrl: string; events: EventItem[] }) => Promise<void>;
}) => {
  const [title, setTitle] = useState(editing?.title || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [initialText, setInitialText] = useState(editing?.initialText || '');
  const [imageUrl, setImageUrl] = useState(editing?.imageUrl || '');
  const [events, setEvents] = useState<EventItem[]>(editing?.events || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(editing?.title || '');
    setDescription(editing?.description || '');
    setInitialText(editing?.initialText || '');
    setImageUrl(editing?.imageUrl || '');
    setEvents(editing?.events || []);
  }, [editing]);

  const addEvent = () => {
    setEvents(prev => [...prev, { messageNumber: 0, prompt: '' }]);
  };

  const removeEvent = (index: number) => {
    setEvents(prev => prev.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: 'messageNumber' | 'prompt', value: string | number) => {
    setEvents(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !initialText.trim()) return;
    setSaving(true);
    await onSave({
      title: title.trim(),
      description: description.trim(),
      initialText: initialText.trim(),
      imageUrl: imageUrl.trim() || DEFAULT_IMAGE,
      events: events.filter(e => e.messageNumber > 0 && e.prompt.trim()),
    });
    setSaving(false);
  };

  return (
    <div className="admin-templates__overlay" onClick={onClose}>
      <div className="admin-templates__modal" onClick={e => e.stopPropagation()}>
        <h2 className="admin-templates__modal-title">
          {editing ? 'Editar plantilla' : 'Nueva plantilla'}
        </h2>
        <form className="admin-templates__form" onSubmit={handleSubmit}>
          <label className="admin-templates__field">
            <span>Título</span>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required disabled={saving} />
          </label>
          <label className="admin-templates__field">
            <span>Descripción</span>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required disabled={saving} rows={2} />
          </label>
          <label className="admin-templates__field">
            <span>Texto inicial (prompt)</span>
            <textarea value={initialText} onChange={e => setInitialText(e.target.value)} required disabled={saving} rows={3} />
          </label>
          <label className="admin-templates__field">
            <span>URL de la imagen</span>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder={DEFAULT_IMAGE} disabled={saving} />
          </label>

          <div className="admin-templates__events-section">
            <div className="admin-templates__events-header">
              <span className="admin-templates__events-label">Eventos</span>
              <Button type="button" size="sm" onClick={addEvent} disabled={saving}>
                + Añadir evento
              </Button>
            </div>
            {events.length === 0 && (
              <p className="admin-templates__events-empty">
                Sin eventos definidos. Los eventos inyectan un prompt extra cuando el usuario llega a un número concreto de mensajes.
              </p>
            )}
            {events.map((ev, i) => (
              <div key={i} className="admin-templates__event">
                <div className="admin-templates__event-row">
                  <label className="admin-templates__field admin-templates__event-field">
                    <span>Mensaje nº</span>
                    <input
                      type="number"
                      min="1"
                      value={ev.messageNumber || ''}
                      onChange={e => updateEvent(i, 'messageNumber', parseInt(e.target.value) || 0)}
                      required
                      disabled={saving}
                    />
                  </label>
                  <Button type="button" size="sm" variant="danger" onClick={() => removeEvent(i)} disabled={saving}>
                    Eliminar
                  </Button>
                </div>
                <label className="admin-templates__field">
                  <span>Prompt del evento</span>
                  <textarea
                    value={ev.prompt}
                    onChange={e => updateEvent(i, 'prompt', e.target.value)}
                    required
                    disabled={saving}
                    rows={2}
                    placeholder="Ej: Introduce un giro dramático: el barco choca contra un iceberg."
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="admin-templates__modal-actions">
            <Button type="button" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear plantilla'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminTemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const showLoading = useDebouncedLoading(loading, 2000);

  const token = useCallback(() => localStorage.getItem('token'), []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await fetcher<Template[]>(`${API_URL}/api/stories`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setTemplates(data);
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al cargar plantillas' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (t: Template) => {
    setEditing(t);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (data: { title: string; description: string; initialText: string; imageUrl: string; events: EventItem[] }) => {
    try {
      if (editing) {
        await fetcher(`${API_URL}/api/stories/${editing._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token()}` },
          body: JSON.stringify(data),
        });
        setMsg({ type: 'ok', text: 'Plantilla actualizada' });
      } else {
        await fetcher(`${API_URL}/api/stories`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token()}` },
          body: JSON.stringify(data),
        });
        setMsg({ type: 'ok', text: 'Plantilla creada' });
      }
      closeModal();
      fetchTemplates();
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' });
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setMsg(null);
    try {
      await fetcher(`${API_URL}/api/stories/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      setMsg({ type: 'ok', text: 'Plantilla eliminada' });
      fetchTemplates();
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al eliminar' });
    } finally {
      setDeleting(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <>
      <BookWrapper
        hideLeftOnMobile
        leftPage={
          <div className="admin-left">
            <h2 className="admin-left__title">Plantillas</h2>
            <p className="admin-left__desc">Crea y gestiona las plantillas de historia disponibles</p>
          </div>
        }
        rightPage={
          <div className="admin-templates">
            {showLoading ? (
              <p className="admin-templates__loading">Cargando...</p>
            ) : (
              <>
                {msg && <p className={`admin-templates__msg admin-templates__msg--${msg.type}`}>{msg.text}</p>}

                <Button onClick={openCreate} fullWidth>
                  + Nueva plantilla
                </Button>

                <div className="admin-templates__list">
                  {templates.map(t => (
                    <div key={t._id} className="admin-templates__item">
                      <img
                        className="admin-templates__item-img"
                        src={t.imageUrl || DEFAULT_IMAGE}
                        alt={t.title}
                      />
                      <div className="admin-templates__item-info">
                        <span className="admin-templates__item-title">{t.title}</span>
                        <span className="admin-templates__item-desc">{t.description}</span>
                      </div>
                      <div className="admin-templates__item-actions">
                        <Button size="sm" onClick={() => openEdit(t)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setConfirmDeleteId(t._id)}
                          disabled={deleting === t._id}
                        >
                          {deleting === t._id ? '...' : 'Eliminar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        }
      />

      {modalOpen && (
        <TemplateModal
          editing={editing}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {confirmDeleteId && (
        <div className="admin-templates__overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="admin-templates__confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p className="admin-templates__confirm-text">
              ¿Eliminar plantilla <strong>{templates.find(t => t._id === confirmDeleteId)?.title}</strong>?
            </p>
            <div className="admin-templates__confirm-actions">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting === confirmDeleteId}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleting === confirmDeleteId}
              >
                {deleting === confirmDeleteId ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
