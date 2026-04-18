import React, { useState } from 'react';
import { useAuthContext } from '../../modules/infrastructure/react/useAuthContext';
import './LoginForm.scss';

export const LoginForm = () => {
  const { login } = useAuthContext();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<string>('');
  const [pass, setPass] = useState<string>('');

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
        />
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Contraseña"
          required
        />
        
        <div className="book-login__actions">
          <button type="submit" className="book-login__submit">
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
          
          <button 
            type="button" 
            className="book-login__switch"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? '¿Ya tienes cuenta?' : '¿Eres nuevo aquí?'}
          </button>
        </div>
      </form>
    </div>
  );
};
