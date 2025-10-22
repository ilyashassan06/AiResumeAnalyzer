import React, { useEffect, useState } from "react";

import { useUserData } from "../Context/UserDataContext";
import ToolForm from "../Components/ToolForm";

function Home() {
  const { userData, loadingUserData,setUserData } = useUserData();

  if (loadingUserData) return <p>Loading user data...</p>;

  return (
    <div className="md:w-[400px] md:h-[600px] border-2 rounded-2xl overflow-hidden">
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
