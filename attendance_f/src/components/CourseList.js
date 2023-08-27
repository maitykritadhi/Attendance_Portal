import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./CourseList.css"; // Import the CSS file

const CourseList = () => {
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourseList() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/prof/getCourses",
          {
            headers: {
              authorization: sessionToken,
            },
          }
        );

        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching course list:", error);
      }
    }

    fetchCourseList();
  }, [sessionToken]);

  const handleGoBackToHomePage = () => {
    navigate("/");
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <div className="course-list-container">
      <h2>Course List</h2>
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course.id} className="course-list-item">
            Course ID: {course.id}, Course Name: {course.cname}
            {"   =>  "}
            <Link to={`/courses/${course.id}`} className="course-link">
              View Students
            </Link>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={handleGoBackToHomePage}>
        Go Back To Home Page
      </button>
    </div>
  );
};

export default CourseList;