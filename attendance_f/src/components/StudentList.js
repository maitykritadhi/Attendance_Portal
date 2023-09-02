import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./StudentList.css"; // Import the CSS file

const StudentList = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudents() {
      try {
        console.log(courseId);
        const response = await axios.get(
          `http://localhost:3000/api/prof/getStudents`,
          {
            headers: {
              authorization: sessionToken,
              course_id: courseId,
            },
          }
        ); // Replace with your backend API endpoint
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student list:", error);
      }
    }

    fetchStudents();
  }, [courseId,sessionToken]);

  const handleCheckboxChange = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
    console.log(selectedStudents);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/prof/assignStudents",
        {
          cid: courseId,
          sid: selectedStudents,
        },
        {
          headers: {
            authorization: sessionToken,
          },
        }
      );
      console.log("Enrollment successful:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error enrolling students:", error);
    }
    
  };

  const handleGoBackToHomePage = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/courses');
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <div className="student-list-container">
      <h2>Students Not Enrolled in Course ID : {courseId}</h2>
      <div className="student-list">
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleCheckboxChange(student.id)}
                />
                Student ID: <span className="bold">{student.id}</span>, Student
                Name: <span className="bold">{student.name}</span>, Student
                Roll: <span className="bold">{student.roll}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="button-container">
        <button className="enroll-button" onClick={handleSubmit}>
          Enroll Selected Students
        </button>
        <button className="goback-button" onClick={handleGoBack}>
          Go Back
        </button>
        <button className="back-button" onClick={handleGoBackToHomePage}>
          Go Back To Home Page
        </button>
      </div>
    </div>
  );
};

export default StudentList;
