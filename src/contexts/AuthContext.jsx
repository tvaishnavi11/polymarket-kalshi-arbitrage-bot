import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Restore session on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (
        storedUser &&
        storedUser !== "undefined" &&
        storedToken &&
        storedToken !== "undefined"
      ) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Auth restore error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Login
  const login = (userData, jwtToken) => {
    if (!userData || !jwtToken) return;

    try {
      setUser(userData);
      setToken(jwtToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken);
    } catch (error) {
      console.error("Login storage error:", error);
    }
  };

  // ✅ Signup (same as login)
  const signup = (userData, jwtToken) => {
    login(userData, jwtToken);
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuth: !!token,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
