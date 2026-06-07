import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/features/auth/context/AuthContext';
import { Logo } from 'src/components/logo/Logo';
import { Button } from 'src/components/buttons/Button';
import { validateAuthForm } from 'src/modules/auth/domain/authValidation';
import './LoginForm.scss';

export const LoginForm = () => {
  const { login, register, isLoading, error, isLoggedIn } = useAuth();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [identifier, setIdentifier] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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
    setConfirmPass('');
    setValidationErrors([]);
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    const errors = validateAuthForm({
      ...(isRegister && { username }),
      email: identifier,
      password: pass,
      ...(isRegister && { confirmPass }),
    });
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (isRegister) {
      const ok = await register({ username, email: identifier, password: pass });
      if (ok) {
        setSuccessMsg('Registro exitoso. Ahora puedes iniciar sesión.');
        setIsRegister(false);
      }
    } else {
      await login({ email: identifier, password: pass });
    }
  };

  return (
    <div className="book-login">
      <div className="book-login__top">
        <Logo width={120} height={120} decorative />
        <div className="book-login__header">
          <h2 className="book-login__title">
            {isRegister ? 'Crea tu historia' : 'Continúa tu historia'}
          </h2>
        </div>
      </div>

      <form id="loginForm" onSubmit={handleSubmit} className="book-login__form">
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
        {isRegister && (
          <div className="book-login__confirm-wrapper">
            <input
              type="password"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              placeholder="Repetir contraseña"
              required
              disabled={isLoading}
            />
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="book-login__validation-errors">
            {validationErrors.map((err, i) => (
              <p key={i} className="book-login__validation-error">{err}</p>
            ))}
          </div>
        )}
        {error && <p className="book-login__error">{error}</p>}
        {successMsg && <p className="book-login__success">{successMsg}</p>}
      </form>

      <div className="book-login__actions">
        <Button type="submit" form="loginForm" disabled={isLoading} fullWidth>
          {isLoading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Entrar')}
        </Button>

        <button
          type="button"
          className="book-login__switch"
          onClick={switchMode}
          disabled={isLoading}
        >
          {isRegister ? '¿Ya tienes cuenta?' : '¿Eres nuevo aquí?'}
        </button>
      </div>
    </div>
  );
};
