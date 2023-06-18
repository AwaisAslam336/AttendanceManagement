import * as React from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const cookies = new Cookies();

const attendanceStates = ["present", "absent", "leave"];
export default function SimpleDialog(props) {
  const { onClose, open, studentId } = props;
  const [value, setValue] = React.useState("");

  const handleRadioChange = (event) => {
    setValue(event.target.value);
  };
  const handleClose = () => {
    onClose();
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const token = cookies.get("TOKEN");
    const configuration = {
      method: "post",
      url: `http://localhost:8000/api/admin/attendance/update`,
      data: {
        id: studentId,
        status: value,
      },
      headers: { Authorization: "Bearer " + token },
    };
    // make the API call
    axios(configuration)
      .then((result) => {
        onClose();
        props.onUpdatePage();
        //console.log(result.data);
      })
      .catch((error) => {
        onClose();
        alert("Error Occured!");
        console.log(error.response.data);
      });
    onClose();
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Update Attendance State</DialogTitle>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ paddingLeft: "10px" }}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={value}
            onChange={handleRadioChange}
          >
            {attendanceStates.map((state) => (
              <FormControlLabel
                value={state}
                control={<Radio />}
                label={state}
              />
            ))}
          </RadioGroup>
          <Button sx={{ m: 1, mr: 2 }} type="submit" variant="outlined">
            Update
          </Button>
        </FormControl>
      </form>
    </Dialog>
  );
}
