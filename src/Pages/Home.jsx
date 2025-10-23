import React, { useEffect, useState } from "react";

import { useUserData } from "../Context/UserDataContext";
import ToolForm from "../Components/ToolForm";

function Home() {
  const { userData, loadingUserData,setUserData } = useUserData();

  if (loadingUserData) return <p>Loading user data...</p>;

  return (
    <div className="h-auto  bg-gray-50 rounded-3xl shadow-xl overflow-hidden p-2 md:p-0 ">
      {/* {userData ? (
        <h2>Welcome, {userData.username}</h2> // ✅ safely render
      ) : (
        <p>Loading user data...</p>
      )} */}
      <ToolForm/>
    </div>
  );
}

export default Home;
