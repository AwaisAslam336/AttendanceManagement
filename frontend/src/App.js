import { Routes, Route } from "react-router-dom";
import SignIn from "./components/Login/SignIn";
import SignUp from "./components/SignUp/SignUp";
import AdminDashboard from "./components/Admin/Dashboard";
import StudentDashboard from "./components/Student/Dashboard";
import StudentAttendanceData from "./components/Admin/StudentAttendanceData";
import SystemReport from "./components/Admin/SystemReport";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route exact path="/SignIn" element={<SignIn />} />
          <Route exact path="/SignUp" element={<SignUp />} />
          <Route exact path="/adminDashboard" element={<AdminDashboard />} />
          <Route
            exact
            path="/studentDashboard"
            element={<StudentDashboard />}
          />
          <Route exact path="/SystemReport" element={<SystemReport />} />
          <Route
            exact
            path="/StudentAttendanceData"
            element={<StudentAttendanceData />}
          />
        </Routes>
      </LocalizationProvider>
    </>
  );
}

export default App;
