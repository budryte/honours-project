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

const disciplineValues = [
  "Mech Eng",
  "Civil CTU",
  "Civil Geotechs",
  "CAHID",
  "LRCFS",
  "Other",
];

const projectTypeValues = [
  "Hons",
  "MSc",
  "PhD",
  "Research",
  "Teaching",
  "Other",
];

export function RequestDetails(props) {
  const { details, setDetails, handleChange } = props;

  const [discipline, setDiscipline] = useState(
    details?.discipline === undefined
      ? ""
      : disciplineValues.includes(details?.discipline)
      ? details?.discipline
      : "Other"
  );
  const [otherDiscipline, setOtherDiscipline] = useState(
    details?.discipline === undefined
      ? ""
      : disciplineValues.includes(details?.discipline)
      ? ""
      : details?.discipline
  );
  const [projectType, setprojectType] = useState(
    details?.projectType === undefined
      ? ""
      : projectTypeValues.includes(details?.projectType)
      ? details?.projectType
      : "Other"
  );
  const [otherProjectType, setOtherProjectType] = useState(
    details?.projectType === undefined
      ? ""
      : projectTypeValues.includes(details?.projectType)
      ? ""
      : details?.projectType
  );
  const [priority, setPriority] = useState(details?.priority ?? "");
  const [approvalRequired, setApprovalRequired] = useState(
    details?.approvalRequired ?? ""
  );
  const [supervisor, setSupervisor] = useState(details?.supervisor ?? "");
  const [account, setAccount] = useState(details?.account ?? "");

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
            onChange={(e) => {
              setDiscipline(e.target.value);
              setDetails((p) => ({
                ...p,
                discipline: e.target.value,
              }));
            }}
          >
            {disciplineValues.map((val) => (
              <MenuItem value={val}>{val}</MenuItem>
            ))}
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
                value={otherDiscipline}
                onChange={(e) => {
                  setOtherDiscipline(e.target.value);
                  setDetails((p) => ({
                    ...p,
                    discipline: e.target.value,
                  }));
                }}
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
            onChange={(e) => {
              setprojectType(e.target.value);
              setDetails((p) => ({
                ...p,
                projectType: e.target.value,
              }));
            }}
          >
            <MenuItem value={"Hons"}>Hons</MenuItem>
            <MenuItem value={"MSc"}>MSc</MenuItem>
            <MenuItem value={"PhD"}>PhD</MenuItem>
            <MenuItem value={"Research"}>Research</MenuItem>
            <MenuItem value={"Teaching"}>Teaching</MenuItem>
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
                value={otherProjectType}
                onChange={(e) => {
                  setOtherProjectType(e.target.value);
                  setDetails((p) => ({
                    ...p,
                    projectType: e.target.value,
                  }));
                }}
              />
            </div>
          ) : undefined}
        </div>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            Priority Level *
          </InputLabel>
          <Select
            className="item"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={priority}
            label="Priority Level *"
            onChange={(e) => {
              setPriority(e.target.value);
              setDetails((p) => ({
                ...p,
                priority: e.target.value,
              }));
            }}
          >
            <MenuItem value={"Low"}>Low</MenuItem>
            <MenuItem value={"Medium"}>Medium</MenuItem>
            <MenuItem value={"Urgent"}>Urgent</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className="item"
          id="outlined-basic"
          label="Supervisor"
          variant="outlined"
          size="small"
          required
          value={supervisor}
          onChange={(e) => {
            setSupervisor(e.target.value);
            setDetails((p) => {
              delete p.account;
              return {
                ...p,
                supervisor: e.target.value,
              };
            });
          }}
        />
        <h3 className="heading">Supervisor approval required? *</h3>
        <FormControl component="fieldset">
          <RadioGroup
            className="radio-group"
            aria-label="gender"
            name="controlled-radio-buttons-group"
            value={approvalRequired}
            onChange={(e) => {
              setApprovalRequired(e.target.value);
              setDetails((p) => ({
                ...p,
                approvalRequired: e.target.value,
              }));
            }}
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        <div>
          {approvalRequired === "No" ? (
            <TextField
              id="outlined-basic"
              label="Account to be charged"
              variant="outlined"
              size="small"
              required
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                setDetails((p) => {
                  delete p.supervisor;
                  return {
                    ...p,
                    account: e.target.value,
                  };
                });
              }}
            />
          ) : undefined}
        </div>
        <div className="buttons">
          <Button
            variant="contained"
            onClick={() => {
              //TO-DO: Error Handling
              handleChange(null, 1);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
