import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const StudentEnquiryResult = () => {
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const navigate = useNavigate();
  const [enquiryResults, setEnquiryResults] = useState([]);

  

  useEffect(() => {
    if (sessionToken && typeofuser === "professor") {
      // navigate("/");
      return <Navigate to="/" replace />;
    }else{
      const fetchEnquiryResults = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/students/studentgetResponse",
            {
              headers: {
                authorization: sessionToken,
              },
            }
          );
          setEnquiryResults(response.data);
        } catch (error) {
          console.error("Error fetching enquiry results:", error);
        }
      };

      fetchEnquiryResults();

    }
    
  }, [sessionToken, typeofuser]);

  const handleBackToStudentDashboard = () => {
    navigate("/login/studentinfo");
  };

  return (
    <>
      <div>
        <h1>Student Enquiry Results</h1>
        <table>
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Student Message</th>
              <th>Professor Message</th>
              <th>Status</th>
              <th>Course ID</th>
            </tr>
          </thead>
          <tbody>
            {enquiryResults.map((result) => (
              <tr key={result.id}>
                <td>{result.id}</td>
                <td>{result.stud_mssg}</td>
                <td>{result.prof_mssg}</td>
                <td>
                  {result.state === 1
                    ? "Accepted"
                    : result.state === 0
                    ? "Pending"
                    : "Rejected"}
                </td>
                <td>{result.course_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={handleBackToStudentDashboard}>
          Go Back To Student Dashboard
        </button>
      </div>
    </>
  );
};

export default StudentEnquiryResult;
