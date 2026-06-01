import { useState, useEffect } from 'react';
import { useAuth } from 'src/features/auth/context/AuthContext';
import { fetcher } from 'src/lib/fetcher';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import './ProfilePage.scss';

const API_URL = import.meta.env.VITE_API_URL;

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetcher<{ _id: string; username: string; email: string; role: string }>(
      `${API_URL}/api/users/account`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(data => {
      setUsername(data.username);
      setEmail(data.email);
    }).catch(() => {
      if (user) {
        setUsername(user.username);
        setEmail(user.email);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const token = localStorage.getItem('token');
      const updated = await fetcher<{ _id: string; username: string; email: string; role: string }>(
        `${API_URL}/api/users/account/edit`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ username, email }),
        }
      );
      const newUser = { id: updated._id, username: updated.username, email: updated.email, role: updated.role };
      updateUser(newUser);
      setMsg({ type: 'ok', text: 'Datos actualizados correctamente' });
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <BookWrapper
      hideLeftOnMobile
      leftPage={
        <div className="profile-left">
          <h2 className="profile-left__title">Mis cosas</h2>
          <p className="profile-left__desc">Revisa y edita tus datos personales</p>
        </div>
      }
      rightPage={
        <div className="profile-page">
          {loading ? (
            <p className="profile-page__loading">Cargando...</p>
          ) : (
            <>
              <h1 className="profile-page__title">Mi cuenta</h1>
              <form className="profile-page__form" onSubmit={handleSave}>
                <label className="profile-page__field">
                  <span>Nombre de usuario</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    disabled={saving}
                  />
                </label>
                <label className="profile-page__field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={saving}
                  />
                </label>
                {msg && <p className={`profile-page__msg profile-page__msg--${msg.type}`}>{msg.text}</p>}
                <button className="profile-page__submit" type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </form>
              <button className="profile-page__logout" onClick={logout}>Cerrar sesión</button>
            </>
          )}
        </div>
      }
    />
  );
};
