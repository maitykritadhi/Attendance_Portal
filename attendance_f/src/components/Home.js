import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Home = () => {
  const sessionToken = localStorage.getItem("token"); // Assuming you store the session token in local storage
  const typeofuser = localStorage.getItem("userType");
  const [userType, setUserType] = useState(); // Default user type
  //   console.log('gnfgn',sessionToken);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions (e.g., clear token, user data, etc.)
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  const handleUserTypeChange1 = () => {
    setUserType("1");
  };

  const handleUserTypeChange2 = () => {
    setUserType("2");
  };

  const handleUserTypeChange3 = () => {
    setUserType("3");
  };

  const handleSubmit = () => {
    if (userType === "1") {
      navigate("/courses"); // Navigate to the assigned courses page
    } else if (userType === "2") {
      navigate("/chooseday"); // Navigate to the mark attendance page
    }else if (userType === "3") {
      navigate("/uchoosedate");
    }
  };

  if (!sessionToken) {
    // navigate("/login");
    return <Navigate to="/login" replace />;
    // return null;
  }

  if (sessionToken && typeofuser === "student"){
    return <Navigate to="/login/studentinfo" replace />;
  }
    return (
      <>
        <div>
          <h1>Welcome to the Home Page</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="mb-3">
          <label>
            <h2>Select Option</h2>
          </label>
          <div>
            <label className="radio-inline">
              <input
                type="radio"
                value="1"
                checked={userType === "1"}
                onChange={handleUserTypeChange1}
              />
              Assign Student Courses
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                value="2"
                checked={userType === "2"}
                onChange={handleUserTypeChange2}
              />
              Mark Attendance
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                value="3"
                checked={userType === "3"}
                onChange={handleUserTypeChange3}
              />
              Update Attendance
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </>
    );
};

export default Home;
