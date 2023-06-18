import { Box, Button } from "@mui/material";
import React from "react";
import AttendanceTable from "./AttendanceTable";
import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();

function StudentDashboard() {
  const handleMarkAttendance = (e) => {
    e.preventDefault();
    const token = cookies.get("TOKEN");
    const configuration = {
      method: "get",
      url: `http://localhost:8000/api/student/mark`,
      headers: { Authorization: "Bearer " + token },
    };
    // make the API call
    axios(configuration)
      .then((result) => {
        console.log(result.data);
        alert(result.data.message);
      })
      .catch((error) => {
        alert("Error Occured!");
        console.log(error.response.data);
      });
  };
  const handleLeaveRequest = (e) => {
    e.preventDefault();
    const token = cookies.get("TOKEN");
    const configuration = {
      method: "get",
      url: `http://localhost:8000/api/student/leave`,
      headers: { Authorization: "Bearer " + token },
    };
    // make the API call
    axios(configuration)
      .then((result) => {
        console.log(result.data);
        alert(result.data.message);
      })
      .catch((error) => {
        alert("Error Occured!");
        console.log(error.response.data);
      });
  };
  return (
    <Box sx={[{ bgcolor: "lavender" }]}>
      <Box sx={[{ display: "flex" }, { justifyContent: "center" }]}>
        <Button
          type="submit"
          variant="contained"
          sx={{ m: 3 }}
          onClick={(e) => handleMarkAttendance(e)}
        >
          Mark Attendance
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{ m: 3 }}
          onClick={(e) => handleLeaveRequest(e)}
        >
          Request Leave
        </Button>
      </Box>
      <AttendanceTable />
    </Box>
  );
}

export default StudentDashboard;
