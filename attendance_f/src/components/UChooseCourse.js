import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";


import "./UChooseCourse.css"; // Import the CSS file

const UChooseCourse = () => {
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const [courses, setCourses] = useState([]);
  const selectedDayId = localStorage.getItem("selectedDayId1"); // Retrieve dayid from localStorage
  console.log(selectedDayId);

  useEffect(() => {
    async function fetchCourseList() {
      try {
        console.log("Fetching courses for dayid:", selectedDayId);
        const response = await axios.get(
          "http://localhost:3000/api/prof/chooseCourse",
          {
            headers: {
              authorization: sessionToken,
              dayid: selectedDayId,
            },
          }
        );

        console.log("Courses response:", response.data);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching course list:", error);
      }
    }

    if (selectedDayId) {
      fetchCourseList();
    }
  }, [sessionToken, selectedDayId]); // Include selectedDayId in the dependency array

  const handleGoBackToHomePage = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }
  
  return (
    <>
      <div className="course-list-container">
        <h2>Choose a Course for Updation of Attendance </h2>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              Course ID: {course.id}, Course Name: {course.cname}
              {"   =>  "}
              <Link to={`/uchoosedate/uchoosecourse/${course.id}`}>
                View Students
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button className="back-button" onClick={handleGoBackToHomePage}>
        Go Back To Home Page
      </button>
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </>
  );
};

export default UChooseCourse;
