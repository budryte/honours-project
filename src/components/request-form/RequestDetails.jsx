import React, { useState } from "react";
import {
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  Button,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

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
      <h2>Request Details</h2>
      <div className="form">
        <FormControl fullWidth size="small">
          <InputLabel id="discipline">Discipline *</InputLabel>
          <Select
            labelId="discipline"
            id="select"
            className="item"
            value={discipline}
            label="Discipline *"
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
                id="other-disicpline"
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
          <InputLabel id="project-type">Project Type *</InputLabel>
          <Select
            className="item"
            labelId="project-type"
            id="project-type"
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
                id="other-project-type"
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
          <InputLabel id="priority-level">Priority Level *</InputLabel>
          <Select
            className="item"
            labelId="priority-level"
            id="priority-level"
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
          id="supervisor's email"
          label="Supervisor's email address"
          variant="outlined"
          size="small"
          required
          value={supervisor}
          onChange={(e) => {
            setSupervisor(e.target.value);
            setDetails((p) => ({
              ...p,
              supervisor: e.target.value,
            }));
          }}
        />
        <p style={{ marginTop: 0 }}>
          <b style={{ color: "red" }}>Important:</b> for testing purposes please
          enter <b>supervisor1@dundee.ac.uk</b> email address and select{" "}
          <b>'Yes'</b> for the question below in order to see this request later
          on the supervisor's account
        </p>
        <h3 className="heading">Supervisor approval required? *</h3>
        <FormControl>
          <RadioGroup
            className="radio-group"
            aria-label="supervisor's approval"
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
            <FormControlLabel
              value="Yes"
              control={<Radio size="small" />}
              label="Yes"
            />
            <FormControlLabel
              value="No"
              control={<Radio size="small" />}
              label="No"
            />
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
                setDetails((p) => ({
                  ...p,
                  account: e.target.value,
                }));
              }}
            />
          ) : undefined}
        </div>
        <div className="buttons">
          <Button
            variant="contained"
            disabled={
              discipline === "" ||
              (discipline === "Other" && otherDiscipline === "") ||
              projectType === "" ||
              (projectType === "Other" && otherProjectType === "") ||
              priority === "" ||
              supervisor === "" ||
              approvalRequired === "" ||
              (approvalRequired === "No" && account === "")
            }
            onClick={() => {
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
