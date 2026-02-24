import React, { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!window.puter) {
          setCurrentUser(null);
          return;
        }

        const user = await window.puter.auth.getUser();
        setCurrentUser(user || null);
      } catch (error) {
        // 401 means no user logged in — THIS IS NORMAL
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};