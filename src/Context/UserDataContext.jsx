import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const UserDataContext = createContext();

export function UserDataProvider({ children }) {
  const { currentUser } = useAuth();

  return (
    <UserDataContext.Provider value={{ userData: currentUser }}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = () => useContext(UserDataContext);