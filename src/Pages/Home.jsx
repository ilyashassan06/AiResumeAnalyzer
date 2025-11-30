import React from "react";
import { useUserData } from "../Context/UserDataContext";
import ToolForm from "../Components/ToolForm";
import { useTheme } from "../Context/ThemeContext";

function Home() {
  const { userData, loadingUserData } = useUserData();
  const { theme } = useTheme();

  if (loadingUserData) return <p>Loading user data...</p>;

  return (
    <div
      className={
        theme === "light"
          ? "min-h-screen w-[100%] bg-gray-50 flex items-start justify-center py-10 px-4"
          : "min-h-screen w-[100%] bg-gray-900 flex items-start justify-center py-10 px-4"
      }
    >
      <div
        className={
          theme === "light"
            ? "w-full  max-w-4xl rounded-3xl shadow-xl bg-white p-4 md:p-6"
            : "w-full max-w-4xl rounded-3xl shadow-xl bg-gray-800/70 border border-gray-700 p-4 md:p-6"
        }
      >
        <ToolForm />
      </div>
    </div>
  );
}

export default Home;
