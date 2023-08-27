import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./StudentDashboard.css";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/students/getStudentInfo",
          {
            headers: {
              authorization: sessionToken,
            },
          }
        );

        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student information:", error);
      }
    };

    fetchStudentInfo();
  }, [sessionToken]);

  if (sessionToken && typeofuser === "professor") {
    // navigate("/");
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    // Logic for logout (e.g., clearing token or state)
    // Redirect to the login page
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login"); // Adjust the route as needed
  };
  
  return (
    <div className="student-dashboard">
      {studentData && (
        <>
          <div className="student-info">
            <h2>Student Information</h2>
            <h3>Name: {studentData.name}</h3>
            <h3>Roll: {studentData.roll}</h3>
            <h3>Email: {studentData.mail}</h3>
          </div>

          <div className="timetable">
            <h2>Timetable</h2>
            <table className="timetable-table">
              <thead>
                <tr>
                  {daysOfWeek.map((day, dayId) => (
                    <th key={dayId}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentData.timetable.map((entry, rowIndex) => (
                  <tr key={rowIndex}>
                    {daysOfWeek.map((_, colIndex) => (
                      <td key={colIndex}>
                        {entry.dayid === colIndex
                          ? studentData.courses.map((course) =>
                              course.id === entry.cid ? (
                                <span className="course-cell" key={course.id}>
                                  {course.cid}
                                </span>
                              ) : (
                                ""
                              )
                            )
                          : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="course-list">
            <h2>List of Courses</h2>
            <ul>
              {studentData.courses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/login/studentinfo/${course.id}`}
                    state={{
                      course: course.id,
                      studentData: studentData,
                    }}
                    className="course-link"
                  >
                    {course.cid}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div className="enquiry-button">
        <button
          className="enquiry-btn"
          onClick={() =>
            navigate("/login/studentinfo/studentenquiry", {
              state: { studentData: studentData },
            })
          }
        >
          Student Enquiry
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default StudentDashboard;
