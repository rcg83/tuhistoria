import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/features/auth/context/AuthContext';
import './LoginForm.scss';

export const LoginForm = () => {
  const { login, isLoading, error, isLoggedIn } = useAuth();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (isRegister) {
      console.log('Registro no implementado');
    } else {
      await login({ email: identifier, password: pass });
    }
  };

  return (
    <div className="book-login">
      <div className="book-login__header">
        <h2 className="book-login__title">
          {isRegister ? 'Crea tu historia' : 'Continúa tu historia'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="book-login__form">
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

        <div className="book-login__actions">
          <button type="submit" className="book-login__submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Entrar')}
          </button>
          
          <button 
            type="button" 
            className="book-login__switch"
            onClick={() => setIsRegister(!isRegister)}
            disabled={isLoading}
          >
            {isRegister ? '¿Ya tienes cuenta?' : '¿Eres nuevo aquí?'}
          </button>
        </div>
      </form>
    </div>
  );
};
