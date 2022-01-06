import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import "./request-form-style.scss";

export function RequestDetails() {
  const [discipline, setDiscipline] = useState("");
  const [projectType, setprojectType] = useState("");
  const [priority, setPriority] = useState("");
  const [supervisorRequired, setSupervisorRequired] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [account, setAccount] = useState("");

  const handleDiscipline = (event) => {
    setDiscipline(event.target.value);
  };

  const handleProjectType = (event) => {
    setprojectType(event.target.value);
  };

  const handlePriority = (event) => {
    setPriority(event.target.value);
  };

  const handleChange = (event) => {
    setSupervisorRequired(event.target.value);
  };

  return (
    <div className="request-form-tab">
      <h2>Fill in Request Details</h2>
      <div className="form">
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">Discipline *</InputLabel>
          <Select
            className="item"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={discipline}
            label="Discipline * "
            onChange={handleDiscipline}
          >
            <MenuItem value={1}>Mech Eng</MenuItem>
            <MenuItem value={2}>Civil CTU</MenuItem>
            <MenuItem value={3}>Civil Geotechs</MenuItem>
            <MenuItem value={4}>CAHID</MenuItem>
            <MenuItem value={5}>LRCFS</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
        </FormControl>
        <div>
          {discipline === "Other" ? (
            <div className="other-item">
              <TextField
                id="outlined-basic"
                label="If other, please specifiy.."
                variant="outlined"
                size="small"
                required
                value={discipline === "Other" ? "" : discipline}
                onChange={() => setDiscipline("")}
              />
            </div>
          ) : undefined}
        </div>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">Project Type *</InputLabel>
          <Select
            className="item"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={projectType}
            label="Project Type *"
            onChange={handleProjectType}
          >
            <MenuItem value={1}>Hons</MenuItem>
            <MenuItem value={2}>MSc</MenuItem>
            <MenuItem value={3}>PhD</MenuItem>
            <MenuItem value={4}>Research</MenuItem>
            <MenuItem value={5}>Teaching</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
        </FormControl>
        <div>
          {projectType === "Other" ? (
            <div className="other-item">
              <TextField
                id="outlined-basic"
                label="If other, please specifiy.."
                variant="outlined"
                size="small"
                required
                value={projectType === "Other" ? "" : projectType}
                onChange={() => setprojectType("")}
              />
            </div>
          ) : undefined}
        </div>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            Priority Level *
          </InputLabel>
          <Select
            className="last-item"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={priority}
            label="Priority Level *"
            onChange={handlePriority}
          >
            <MenuItem value={1}>Low</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>Urgent</MenuItem>
          </Select>
        </FormControl>
        <h3 className="heading">Supervisor required? *</h3>
        <FormControl component="fieldset">
          <RadioGroup
            className="radio-group"
            aria-label="gender"
            name="controlled-radio-buttons-group"
            value={supervisorRequired}
            onChange={handleChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        <div>
          {supervisorRequired === "yes" ? (
            <TextField
              id="outlined-basic"
              label="Supervisor"
              variant="outlined"
              size="small"
              required
              value={supervisor}
            />
          ) : undefined}
          {supervisorRequired === "no" ? (
            <TextField
              id="outlined-basic"
              label="Account to be charged"
              variant="outlined"
              size="small"
              type="number"
              required
              value={account}
            />
          ) : undefined}
        </div>
        <div className="buttons">
          <Button variant="contained">Next</Button>
        </div>
      </div>
    </div>
  );
}
