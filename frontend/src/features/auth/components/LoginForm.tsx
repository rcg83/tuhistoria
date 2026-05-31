import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/features/auth/context/AuthContext';
import { Logo } from 'src/components/logo/Logo';
import './LoginForm.scss';

export const LoginForm = () => {
  const { login, register, isLoading, error, isLoggedIn } = useAuth();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [identifier, setIdentifier] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/stories');
    }
  }, [isLoggedIn, navigate]);

  const switchMode = () => {
    setIsRegister(!isRegister);
    setUsername('');
    setIdentifier('');
    setPass('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (isRegister) {
      await register({ username, email: identifier, password: pass });
      setSuccessMsg('Registro exitoso. Ahora puedes iniciar sesión.');
      setIsRegister(false);
    } else {
      await login({ email: identifier, password: pass });
    }
  };

  return (
    <div className="book-login">
      <div className="book-login__top">
        <Logo width={140} height={140} decorative />
      </div>

      <div className="book-login__bottom">
        <div className="book-login__header">
          <h2 className="book-login__title">
            {isRegister ? 'Crea tu historia' : 'Continúa tu historia'}
          </h2>
        </div>

      <form onSubmit={handleSubmit} className="book-login__form">
        {isRegister && (
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            required
            disabled={isLoading}
          />
        )}
        <input
          type="text"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          placeholder="Email"
          required
          disabled={isLoading}
        />
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Contraseña"
          required
          disabled={isLoading}
        />
        
        {error && <p className="book-login__error">{error}</p>}
        {successMsg && <p className="book-login__success">{successMsg}</p>}

        <div className="book-login__actions">
          <button type="submit" className="book-login__submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Entrar')}
          </button>
          
          <button 
            type="button" 
            className="book-login__switch"
            onClick={switchMode}
            disabled={isLoading}
          >
            {isRegister ? '¿Ya tienes cuenta?' : '¿Eres nuevo aquí?'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};
