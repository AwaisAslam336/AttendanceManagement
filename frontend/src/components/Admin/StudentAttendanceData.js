import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Cookies from "universal-cookie";
import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";
import UpdateDialog from "./UpdateDialog";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const cookies = new Cookies();

UpdateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  studentId: PropTypes.string.isRequired,
};
export default function StudentAttendanceData() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [presentsCount, setPresentsCount] = React.useState(0);
  const [absentsCount, setAbsentsCount] = React.useState(0);
  const [leavesCount, setLeavesCount] = React.useState(0);
  const [gradeState, setGradeState] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [studentId, setStudentId] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  React.useEffect(() => {
    const token = cookies.get("TOKEN");

    const search = window.location.search; // returns the URL query String
    const params = new URLSearchParams(search);
    const IdFromURL = params.get("id");
    const configuration = {
      method: "get",
      url: `http://localhost:8000/api/student/view?id=${IdFromURL}`,
      headers: { Authorization: "Bearer " + token },
    };
    // make the API call
    axios(configuration)
      .then((result) => {
        setRows(result.data.data);
        setLeavesCount(result.data.leaves);
        setPresentsCount(result.data.presents);
        setAbsentsCount(result.data.absents);
        setGradeState(result.data.grade);
      })
      .catch((error) => {
        alert("Error Occured!");
        console.log(error.response.data);
      });
  }, [value]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const refreshPage = () => {
    setValue((value) => value + 1);
  };
  const handleDelete = (id) => {
    const token = cookies.get("TOKEN");
    const configuration = {
      method: "get",
      url: `http://localhost:8000/api/admin/attendance/delete?id=${id}`,
      headers: { Authorization: "Bearer " + token },
    };
    // make the API call
    axios(configuration)
      .then((result) => {
        setValue((value) => value + 1);
        //window.location.reload();
        //alert("Attendance Deleted!");
        //console.log(result.data);
      })
      .catch((error) => {
        alert("Error Occured!");
        console.log(error.response.data);
      });
  };
  const handleUpdate = (id) => {
    setStudentId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDateFilter = () => {
    //console.log(fromDate.$d, "---", toDate.$d);
    if (!fromDate || !toDate) {
      alert("please select both FROM & TO dates!");
      return;
    }
    const token = cookies.get("TOKEN");

    const search = window.location.search; // returns the URL query String
    const params = new URLSearchParams(search);
    const IdFromURL = params.get("id");
    const configuration = {
      method: "get",
      url: `http://localhost:8000/api/student/view?id=${IdFromURL}&fromDate=${fromDate.$d}&toDate=${toDate.$d}`,
      headers: { Authorization: "Bearer " + token },
    };
    // make the API call
    axios(configuration)
      .then((result) => {
        setRows(result.data.data);
        setLeavesCount(result.data.leaves);
        setPresentsCount(result.data.presents);
        setAbsentsCount(result.data.absents);
        setGradeState(result.data.grade);
      })
      .catch((error) => {
        alert("Error Occured!");
        console.log(error.response.data);
      });
  };
  return (
    <Paper sx={[{ bgcolor: "lavender" }]}>
      <TableContainer sx={[{ padding: 5 }]}>
        <Button sx={{ m: 2 }} variant="contained">
          Total Presents: {presentsCount}
        </Button>
        <Button sx={{ m: 2 }} variant="contained">
          Total Absents: {absentsCount}
        </Button>
        <Button sx={{ m: 2 }} variant="contained">
          Total Leaves: {leavesCount}
        </Button>
        <Button sx={{ m: 2 }} variant="contained">
          Grade: {gradeState}
        </Button>

        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(newDate) => setFromDate(newDate)}
          />
        </DemoContainer>

        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(newDate) => setToDate(newDate)}
          />
        </DemoContainer>
        <Button
          variant="contained"
          sx={{ mt: 1, mb: 3 }}
          onClick={handleDateFilter}
        >
          Filter Attendance by Date
        </Button>

        <h3>Attendance Table</h3>
        <Table aria-label="attendance table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(row._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleUpdate(row._id)}
                      >
                        Update
                      </Button>
                      <UpdateDialog
                        studentId={studentId}
                        open={open}
                        onClose={handleClose}
                        onUpdatePage={refreshPage}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
