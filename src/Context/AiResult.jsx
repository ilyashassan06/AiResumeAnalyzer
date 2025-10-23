// src/Context/AiContext.js
import { createContext, useContext, useState } from "react";

const AiContext = createContext();

export const AiProvider = ({ children }) => {
  const [aiData, setAiData] = useState(null);
  return (
    <AiContext.Provider value={{ aiData, setAiData }}>
      {children}
    </AiContext.Provider>
  );
};

export const useAi = () => useContext(AiContext);
