import { useState } from "react";
import AuthContext from "./AuthContext";
import { getCurrentUser, logoutUser } from "../services/authService";

function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;