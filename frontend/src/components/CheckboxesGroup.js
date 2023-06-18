import * as React from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

export default function CheckboxesGroup(props) {
  const [state, setState, getState] = React.useState({
    Admin: true,
    Student: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  React.useEffect(() => {
    props.onDataChange(state);
  }, [state]);

  const { Admin, Student } = state;
  const error = [Admin, Student].filter((v) => v).length !== 1;

  return (
    <Box>
      <FormControl
        required
        error={error}
        component="fieldset"
        variant="standard"
      >
        <FormLabel>Select User Type</FormLabel>
        <FormGroup sx={{ flexDirection: "row" }}>
          <FormControlLabel
            control={
              <Checkbox checked={Admin} onChange={handleChange} name="Admin" />
            }
            label="Admin"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Student}
                onChange={handleChange}
                name="Student"
              />
            }
            label="Student"
          />
        </FormGroup>
        <FormHelperText>Please Pick One!</FormHelperText>
      </FormControl>
    </Box>
  );
}
