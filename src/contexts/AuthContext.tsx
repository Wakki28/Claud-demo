// 認証コンテキスト（デモ用：常に管理者として動作）
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type AuthContextType = {
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({ isAdmin: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ isAdmin: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
