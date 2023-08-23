/*
import React from "react";
import { useLocation } from "react-router-dom";

const CourseAttendanceDetails = () => {
  const location = useLocation();
  console.log(location.state);
  const { ncourse, studentData } = location.state;
//   const { name, roll, mail, attendance, courses } = studentData;
  const courseId = parseInt(location.pathname.split("/").pop(), 10); // Extract courseId from URL
  console.log(courseId);


  return (
    <>HI</>
  );
};

export default CourseAttendanceDetails;
*/

// CourseAttendanceDetails.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CourseAttendanceDetails.css"; // Import the CSS file

const CourseAttendanceDetails = () => {
  const location = useLocation();
  const { studentData } = location.state;
  const navigate = useNavigate();
  const courseId = parseInt(location.pathname.split("/").pop(), 10);

  const course = studentData.courses.find((course) => course.id === courseId);
  const courseAttendance = studentData.attendance.filter(
    (entry) => entry.course_id === courseId
  );

  const handleLogout = () => {
    // Logic for logout (e.g., clearing token or state)
    // Redirect to the login page
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login"); // Adjust the route as needed
  };

  const handleGoBack = () => {
    // Navigate back to the previous page
    navigate('/login/studentinfo');
  };

  return (
    <div>
      <div className="student-details">
        <h2>Student Details</h2>
        <p>Name: {studentData.name}</p>
        <p>Roll: {studentData.roll}</p>
        <p>Email: {studentData.mail}</p>
      </div>

      {course && (
        <div className="course-details">
          <h2>Course Details</h2>
          <p>Course ID: {course.id}</p>
          <p>Course Name: {course.cid}</p>
        </div>
      )}

      <div className="attendance-details">
        <h2>Attendance Details</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {courseAttendance.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td className={entry.attendance === "P" ? "present" : "absent"}>
                  {entry.attendance === "P" ? "Present" : "Absent"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttons">
        <button onClick={handleGoBack}>Go Back</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default CourseAttendanceDetails;



