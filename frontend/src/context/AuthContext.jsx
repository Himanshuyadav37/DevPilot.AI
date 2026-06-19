import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("dp_token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("dp_user");
    return u ? JSON.parse(u) : null;
  });

  const login = useCallback((accessToken, userData) => {
    localStorage.setItem("dp_token", accessToken);
    localStorage.setItem("dp_user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dp_token");
    localStorage.removeItem("dp_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { AuthContext };