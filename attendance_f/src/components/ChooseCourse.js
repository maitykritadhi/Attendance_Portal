import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const ChooseCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const selectedDayId = location?.state?.selectedDay;

  useEffect(() => {
    async function fetchCourseList() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/prof/chooseCourse",
          {
            headers: {
              authorization: sessionToken,
              dayid: selectedDayId,
            },
          }
        );

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

  return (
    <>
      <div>
        <h2>Choose a Course</h2>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              Course ID: {course.id}, Course Name: {course.cname}
              {"   =>  "}
              <Link to={`/chooseday/choosecourse/${course.id}`}>
                View Students
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleGoBackToHomePage}>Go Back To Home Page</button>
    </>
  );
};

export default ChooseCourse;
