import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const UChooseDate = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const navigate = useNavigate(); // Add this line to get the navigate function

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleUpdateDate = async () => {
    try {
      const selectedDateWithOffset = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      const formattedDate = selectedDateWithOffset.toISOString().split("T")[0];
      //   const formattedDate = "2023-08-01";
      console.log(formattedDate);
      console.log(typeof formattedDate);

      // Store formattedDate in local storage
      localStorage.setItem("formattedDate", formattedDate);
      
      const response = await axios.get(
        "http://localhost:3000/api/prof/getChosenDateUpdation",
        {
          headers: {
            authorization: sessionToken,
            sdate: formattedDate,
          },
        }
      );
      console.log(response);
      // Get the dayid from the response or calculate it based on your requirement
      const dayid = response.data.dayid; // Assuming the response contains dayid
      console.log(dayid);

      // Store dayid in localStorage
      localStorage.setItem("selectedDayId1", dayid);

      // Navigate to the next page along with dayid as state
      // You can replace "nextPagePath" with the actual path of your next page
      navigate("/uchoosedate/uchoosecourse");

      // You can perform further actions here, such as displaying a success message
    } catch (error) {
      console.error("Error updating date:", error);
    }
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <div>
      <h2>Choose Date</h2>
      <DatePicker selected={selectedDate} onChange={handleDateChange} />
      <button onClick={handleUpdateDate}>Submit Date</button>
    </div>
  );
};

export default UChooseDate;
