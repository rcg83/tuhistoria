import React, { createContext, useContext, useState, useMemo } from 'react';
import { type AuthState, initialAuthState, createAuthStore } from '../../../modules/auth/application/authStoreFactory';
import { type AuthApi } from "../../../modules/auth/domain/AuthApi";

export type AuthStoreContextType = ReturnType<typeof createAuthStore>;

const AuthContext = createContext<AuthStoreContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode; api: AuthApi }> = ({ children, api }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  const storeElements = useMemo(() => 
    createAuthStore(api, state, setState), 
  [api, state]);

  return (
    <AuthContext.Provider value={storeElements}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
