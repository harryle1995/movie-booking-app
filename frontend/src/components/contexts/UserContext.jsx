import { createContext, useState, useEffect } from "react";

// 🔸 Create a global context to hold and share user authentication state
export const UserContext = createContext();

// 🔸 Provider component that wraps your app and exposes user state + login/logout functions
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function login(userData, token) {
    const fullUser = { ...userData, token };
    setUser(fullUser);
    localStorage.setItem("user", JSON.stringify(fullUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}