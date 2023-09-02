/*
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfReceiveEnquiry = () => {
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/prof/getprofRequestReceive",
          {
            headers: {
              authorization: sessionToken,
            },
            //   requestBody,
          }
        );
        setEnquiries(response.data);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };

    fetchEnquiries();
  }, []);

  return (
    <div>
      <h1>Student Enquiries</h1>
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Student Name</th>
            <th>Student Roll</th>
            <th>Student Mail</th>
            <th>Student ID</th>
            <th>Student Message</th>
            <th>Status</th>
            <th>Course Name</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id}>
              <td>{enquiry.id}</td>
              <td>{enquiry.name}</td>
              <td>{enquiry.roll}</td>
              <td>{enquiry.mail}</td>
              <td>{enquiry.stud_id}</td>
              <td>{enquiry.stud_mssg}</td>
              <td>{enquiry.state === 0 ? "Pending" : "Other Status"}</td>
              <td>{enquiry.cname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfReceiveEnquiry;
*/
/*
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfReceiveEnquiry = () => {
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/prof/getprofRequestReceive",
          {
            headers: {
              authorization: sessionToken,
            },
          }
        );
        setEnquiries(response.data);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };

    fetchEnquiries();
  }, []);

  const [profMssgInput, setProfMssgInput] = useState(""); // State for the professor's message input

  const handleUpdateRequest = async (id, newState) => {
    try {
      let prof_mssg = "";

      if (newState === 1 || newState === 2) {
        prof_mssg = profMssgInput; // Use the input from state
        if (prof_mssg.trim() === "") {
          alert("Please enter a response message.");
          return;
        }
      }

      await axios.put(
        "http://localhost:3000/api/prof/profRequestUpdate",
        {
          id: id,
          prof_mssg: prof_mssg,
          state: newState,
        },
        {
          headers: {
            authorization: sessionToken,
          },
        }
      );

      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry.id === id
            ? { ...enquiry, state: newState, prof_mssg: prof_mssg }
            : enquiry
        )
      );

      setProfMssgInput(""); // Clear the input after update
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <div>
      <h1>Student Enquiries</h1>
      <table>
        <tr>
          <th>Request ID</th>
          <th>Student Name</th>
          <th>Student Roll</th>
          <th>Student Mail</th>
          <th>Student ID</th>
          <th>Student Message</th>
          <th>Status</th>
          <th>Course Name</th>
        </tr>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id}>
              <td>{enquiry.id}</td>
              <td>{enquiry.name}</td>
              <td>{enquiry.roll}</td>
              <td>{enquiry.mail}</td>
              <td>{enquiry.stud_id}</td>
              <td>{enquiry.stud_mssg}</td>
              <td>{enquiry.state === 0 ? "Pending" : "Other Status"}</td>
              <td>{enquiry.cname}</td>
              <td>
                {enquiry.state === 0 ? (
                  <div>
                    <textarea
                      value={profMssgInput}
                      onChange={(e) => setProfMssgInput(e.target.value)}
                      placeholder="Enter your response..."
                    />
                    <button onClick={() => handleUpdateRequest(enquiry.id, 1)}>
                      Accept
                    </button>
                    <button onClick={() => handleUpdateRequest(enquiry.id, 2)}>
                      Reject
                    </button>
                  </div>
                ) : (
                  "Handled"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfReceiveEnquiry;
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import './ProfReceiveEnquiry.css'; // Import the CSS file

const ProfReceiveEnquiry = () => {
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/prof/getprofRequestReceive",
          {
            headers: {
              authorization: sessionToken,
            },
          }
        );
        setEnquiries(response.data);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };

    fetchEnquiries();
  }, [sessionToken]);

  const [profMssgInputs, setProfMssgInputs] = useState({}); // State for the professor's message inputs

  const handleUpdateRequest = async (id, newState) => {
    try {
      let prof_mssg = "";

      if (newState === 1 || newState === 2) {
        prof_mssg = profMssgInputs[id] || ""; // Use the input from state
      }

      await axios.put(
        "http://localhost:3000/api/prof/profRequestUpdate",
        {
          id: id,
          prof_mssg: prof_mssg,
          state: newState,
        },
        {
          headers: {
            authorization: sessionToken,
          },
        }
      );

      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry.id === id
            ? {
                ...enquiry,
                state: newState,
                prof_mssg: prof_mssg,
              }
            : enquiry
        )
      );

      setProfMssgInputs((prevInputs) => ({
        ...prevInputs,
        [id]: "", // Clear the input after update
      }));
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <>
      <div>
        <h1>Student Enquiries</h1>
        <table className="custom-table">
          <tr>
            <th>Request ID</th>
            <th>Student Name</th>
            <th>Student Roll</th>
            <th>Student Mail</th>
            <th>Student ID</th>
            <th>Student Message</th>
            <th>Status</th>
            <th>Course Name</th>
          </tr>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>{enquiry.id}</td>
                <td>{enquiry.name}</td>
                <td>{enquiry.roll}</td>
                <td>{enquiry.mail}</td>
                <td>{enquiry.stud_id}</td>
                <td>{enquiry.stud_mssg}</td>
                <td>
                  {enquiry.state === 0
                    ? "Pending"
                    : enquiry.state === 1
                    ? "Accepted"
                    : "Rejected"}
                </td>
                <td>{enquiry.cname}</td>
                <td>
                  {enquiry.state === 0 ? (
                    <div>
                      <textarea
                        value={profMssgInputs[enquiry.id] || ""}
                        onChange={(e) =>
                          setProfMssgInputs((prevInputs) => ({
                            ...prevInputs,
                            [enquiry.id]: e.target.value,
                          }))
                        }
                        placeholder="Enter your response..."
                      />
                      <button
                        onClick={() => handleUpdateRequest(enquiry.id, 1)}
                        className="accept-button"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateRequest(enquiry.id, 2)}
                        className="reject-button"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    "Handled"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button className="go-back-button" onClick={handleBackToHome}>
          Go Back To Home Page
        </button>
      </div>
    </>
  );
};

export default ProfReceiveEnquiry;





