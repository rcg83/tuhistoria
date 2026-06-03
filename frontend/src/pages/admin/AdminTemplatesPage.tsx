import { useState, useEffect, useCallback } from 'react';
import { fetcher } from 'src/lib/fetcher';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import { useDebouncedLoading } from 'src/hooks/useDebouncedLoading';
import './AdminTemplatesPage.scss';

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_IMAGE = '/images/libro.png';

type Template = {
  _id: string;
  title: string;
  description: string;
  initialText: string;
  imageUrl?: string;
};

const TemplateModal = ({
  editing,
  onClose,
  onSave,
}: {
  editing: Template | null;
  onClose: () => void;
  onSave: (data: { title: string; description: string; initialText: string; imageUrl: string }) => Promise<void>;
}) => {
  const [title, setTitle] = useState(editing?.title || '');
  const [description, setDescription] = useState(editing?.description || '');
  const [initialText, setInitialText] = useState(editing?.initialText || '');
  const [imageUrl, setImageUrl] = useState(editing?.imageUrl || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(editing?.title || '');
    setDescription(editing?.description || '');
    setInitialText(editing?.initialText || '');
    setImageUrl(editing?.imageUrl || '');
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !initialText.trim()) return;
    setSaving(true);
    await onSave({
      title: title.trim(),
      description: description.trim(),
      initialText: initialText.trim(),
      imageUrl: imageUrl.trim() || DEFAULT_IMAGE,
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
          <div className="admin-templates__modal-actions">
            <button type="button" className="admin-templates__modal-cancel" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button className="admin-templates__submit" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear plantilla'}
            </button>
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

  const handleSave = async (data: { title: string; description: string; initialText: string; imageUrl: string }) => {
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

                <button className="admin-templates__add" onClick={openCreate}>
                  + Nueva plantilla
                </button>

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
                        <button className="admin-templates__edit" onClick={() => openEdit(t)}>
                          Editar
                        </button>
                        <button
                          className="admin-templates__delete"
                          onClick={() => handleDelete(t._id)}
                          disabled={deleting === t._id}
                        >
                          {deleting === t._id ? '...' : 'Eliminar'}
                        </button>
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
    </>
  );
};
