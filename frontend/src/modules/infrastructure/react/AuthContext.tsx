import { createContext, useEffect, type ReactNode } from 'react';
import { useAuthStoreInternal } from './useAuthStoreInternal';

export type AuthContextType = ReturnType<typeof useAuthStoreInternal>;

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthStoreInternal();
  
  useEffect(() => {
    auth.checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
