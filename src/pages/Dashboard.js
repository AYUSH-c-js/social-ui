import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/mon serveprofile")
  }, []);
  return (
    <div>
      <Navbar />
      <h1>Welcome to Your Dashboard</h1>
      <p>Select an option from the navbar to continue.</p>
    </div>
  );
};

export default Dashboard;
