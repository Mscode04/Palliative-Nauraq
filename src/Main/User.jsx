import React from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";

function User({ isAuthenticated, isNurse }) {
  const { patientId } = useParams(); // Access patientId from the URL
  const navigate = useNavigate(); // Move useNavigate to the top

  // Redirect to login if not authenticated or is a nurse
  if (!isAuthenticated || isNurse) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    navigate("/logout"); // Navigate to the /logout route
  };

  return (
    <div>
      <h1>Welcome, User!</h1>
      <h1>This is the User Page</h1>
      {patientId && <p>Your Patient ID: {patientId}</p>} {/* Conditionally render patientId */}
      <button className="btn btn-danger w-100" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default User;