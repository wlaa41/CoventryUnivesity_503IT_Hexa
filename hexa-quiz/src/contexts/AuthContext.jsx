import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hexa-user")) || null; } catch { return null; }
  });

  function login(username, password) {
    const users = JSON.parse(localStorage.getItem("hexa-users") || "{}");
    if (!users[username]) return "User not found.";
    if (users[username].password !== password) return "Wrong password.";
    const u = { username, isGuest: false };
    setUser(u);
    localStorage.setItem("hexa-user", JSON.stringify(u));
    return null;
  }

  function signup(username, password) {
    if (!username.trim() || !password.trim()) return "All fields required.";
    if (username.length < 3) return "Username must be at least 3 characters.";
    if (password.length < 4) return "Password must be at least 4 characters.";
    const users = JSON.parse(localStorage.getItem("hexa-users") || "{}");
    if (users[username]) return "Username already taken.";
    users[username] = { password, history: [] };
    localStorage.setItem("hexa-users", JSON.stringify(users));
    const u = { username, isGuest: false };
    setUser(u);
    localStorage.setItem("hexa-user", JSON.stringify(u));
    return null;
  }

  function playAsGuest() {
    const u = { username: "Guest", isGuest: true };
    setUser(u);
    localStorage.setItem("hexa-user", JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("hexa-user");
  }

  function saveGameResult(result) {
    if (!user || user.isGuest) return;
    const users = JSON.parse(localStorage.getItem("hexa-users") || "{}");
    if (!users[user.username]) return;
    const history = users[user.username].history || [];
    history.unshift({ ...result, date: new Date().toLocaleDateString() });
    users[user.username].history = history.slice(0, 20);
    localStorage.setItem("hexa-users", JSON.stringify(users));
  }

  function getHistory() {
    if (!user || user.isGuest) return [];
    const users = JSON.parse(localStorage.getItem("hexa-users") || "{}");
    return users[user.username]?.history || [];
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, playAsGuest, logout, saveGameResult, getHistory }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
