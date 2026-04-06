import React, { useState } from 'react'; // Importación limpia
import { useAuthContext } from '../../modules/infrastructure/react/useAuthContext';

export const LoginModal = ({ onClose }: { onClose: () => void }) => {
    const { login } = useAuthContext();
    const [identifier, setIdentifier] = useState<string>('');
    const [pass, setPass] = useState<string>('');

    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();

        await login({ username: identifier, password: pass });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        placeholder="Usuario o Email"
                    />
                    <input
                        type="password"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        placeholder="Contraseña"
                    />
                    <div className="actions">
                        <button type="submit">Entrar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
