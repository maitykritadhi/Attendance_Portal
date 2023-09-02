import React, { useState } from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./StudentEnquiry.css"; // Import the CSS file

const StudentEnquiry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");

  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const { studentData } = location.state;

  if (sessionToken && typeofuser === "professor") {
    // navigate("/");
    return <Navigate to="/" replace />;
  }

  const handleSendMessage = async () => {
    try {
    //   const requestBody = {
    //     mssg: message,
    //     id: selectedCourse,
    //   };

      const response = await axios.post(
        "http://localhost:3000/api/students/studentRequest",
        {
          mssg: message,
          id: selectedCourse,
        },
        {
          headers: {
            authorization: sessionToken,
          },
          //   requestBody,
        }
      );
      console.log(response.data.message); // Display success message

      // Optionally, you can perform some actions after sending the request.
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error scenario
    }
  };

  const handleBackToStudentInfo = ()=>{
    navigate("/login/studentinfo");
  };

  const handleCheckEnquiryResult = ()=>{
    navigate("/login/studentinfo/studentenquiryresult");
  };

  return (
    <div className="student-enquiry">
      <h1>Student Enquiry</h1>
      <div>
        <h2>Welcome, {studentData.name}!</h2>
        <p>Select the course you have an enquiry about:</p>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select a course</option>
          {studentData.courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.cid}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p>Write your message to the professor:</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          cols="50"
        />
      </div>
      <div>
        <button className="send-btn" onClick={handleSendMessage}>
          Send Enquiry To Professor
        </button>
      </div>
      <div>
        <button className="check-btn" onClick={handleCheckEnquiryResult}>
          Check Enquiry result
        </button>
      </div>
      <div>
        <button className="back-btn" onClick={handleBackToStudentInfo}>
          Go Back To Student Dashboard
        </button>
      </div>
    </div>
  );
};

export default StudentEnquiry;
