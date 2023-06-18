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
import { Button } from "@mui/material";
const cookies = new Cookies();

export default function StudentsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const token = cookies.get("TOKEN");
    const configuration = {
      method: "get",
      url: `http://localhost:8000/api/admin/students`,
      headers: { Authorization: "Bearer " + token },
    };
    // make the API call
    axios(configuration)
      .then((result) => {
        setRows(result.data.data);
      })
      .catch((error) => {
        alert("Error Occured!");
        console.log(error.response.data);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  function handleClick(id) {
    window.location.href = `/studentAttendanceData?id=${id}`;
    // const token = cookies.get("TOKEN");
    // const configuration = {
    //   method: "get",
    //   url: `http://localhost:8000/api/student/view?id=${id}`,
    //   headers: { Authorization: "Bearer " + token },
    // };
    // // make the API call
    // axios(configuration)
    //   .then((result) => {
    //     console.log(result.data);
    //   })
    //   .catch((error) => {
    //     alert("Error Occured!");
    //     console.log(error.response.data);
    //   });
  }

  return (
    <Paper sx={[{ bgcolor: "lavender" }, { flex: "none" }]}>
      <TableContainer sx={[{ maxHeight: 440 }, { padding: 5 }]}>
        <h3>Students Table</h3>
        <Table aria-label="attendance table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <TableCell>{row.student_name}</TableCell>
                    <TableCell>{row.student_email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleClick(row._id)}
                      >
                        View Attendance
                      </Button>
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
