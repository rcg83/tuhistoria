import { useState, useEffect } from 'react';
import { useAuth } from 'src/features/auth/context/AuthContext';
import { fetcher } from 'src/lib/fetcher';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import { useDebouncedLoading } from 'src/hooks/useDebouncedLoading';
import './AdminUsersPage.scss';

const API_URL = import.meta.env.VITE_API_URL;

type User = {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
};

const UserEditModal = ({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (data: { username: string; email: string; role: 'user' | 'admin' }) => Promise<void>;
}) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    setSaving(true);
    await onSave({ username: username.trim(), email: email.trim(), role });
    setSaving(false);
  };

  return (
    <div className="admin-page__overlay" onClick={onClose}>
      <div className="admin-page__modal" onClick={e => e.stopPropagation()}>
        <h2 className="admin-page__modal-title">Editar usuario</h2>
        <form className="admin-page__form" onSubmit={handleSubmit}>
          <label className="admin-page__field">
            <span>Nombre de usuario</span>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required disabled={saving} />
          </label>
          <label className="admin-page__field">
            <span>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={saving} />
          </label>
          <label className="admin-page__field">
            <span>Rol</span>
            <select value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')} disabled={saving}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <div className="admin-page__modal-actions">
            <button type="button" className="admin-page__modal-cancel" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button className="admin-page__submit" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const showLoading = useDebouncedLoading(loading, 2000);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await fetcher<User[]>(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (data: { username: string; email: string; role: 'user' | 'admin' }) => {
    if (!editing) return;
    try {
      await fetcher(`${API_URL}/api/users/admin/${editing._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      setMsg({ type: 'ok', text: `${data.username} actualizado correctamente` });
      setEditing(null);
      fetchUsers();
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al actualizar' });
    }
  };

  return (
    <>
      <BookWrapper
        hideLeftOnMobile
        leftPage={
          <div className="admin-left">
            <h2 className="admin-left__title">Administración</h2>
            <p className="admin-left__desc">Gestiona los usuarios registrados en la plataforma</p>
          </div>
        }
        rightPage={
          <div className="admin-page">
            {showLoading ? (
              <p className="admin-page__loading">Cargando...</p>
            ) : (
              <>
                {msg && <p className={`admin-page__msg admin-page__msg--${msg.type}`}>{msg.text}</p>}

                <div className="admin-page__list">
                  {users.map(u => (
                    <div key={u._id} className="admin-page__user">
                      <div className="admin-page__user-info">
                        <span className="admin-page__user-name">{u.username}</span>
                        <span className="admin-page__user-email">{u.email}</span>
                      </div>
                      <span className={`admin-page__badge admin-page__badge--${u.role}`}>
                        {u.role === 'admin' ? 'admin' : 'user'}
                      </span>
                      {currentUser && u._id !== currentUser.id && (
                        <button className="admin-page__edit" onClick={() => setEditing(u)}>
                          Editar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        }
      />

      {editing && (
        <UserEditModal
          user={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
};
