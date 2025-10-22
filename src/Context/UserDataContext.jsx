// src/Context/UserDataContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // your existing AuthContext
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const UserDataContext = createContext();

export function UserDataProvider({ children }) {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setUserData(null);
        setLoadingUserData(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No user data found!");
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <UserDataContext.Provider value={{ userData, loadingUserData,setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

// ✅ Custom hook to use user data anywhere
export const useUserData = () => useContext(UserDataContext);
