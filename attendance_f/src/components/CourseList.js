import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

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
    <>
      <div>
        <h2>Course List</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              Course ID: {course.id}, Course Name: {course.cname}
              {"   =>  "}
              <Link to={`/courses/${course.id}`}> View Students</Link>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleGoBackToHomePage}>Go Back To Home Page</button>
    </>
  );
};

export default CourseList;