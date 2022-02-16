import React, { useState } from "react";
import { RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";

export default function Filters(props) {
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  return (
    <div>
      <h2>Filter by:</h2>
      <h3>Status</h3>
      <RadioGroup
        className="radio-group"
        name="controlled-radio-buttons-group"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          props.setFilters({ status: e.target.value, priority: priority });
        }}
      >
        <FormControlLabel
          value="Pending approval"
          control={<Radio />}
          label="Pending approval"
        />
        <FormControlLabel
          value="In progress"
          control={<Radio />}
          label="In progress"
        />
        <FormControlLabel
          value="Waiting on technician"
          control={<Radio />}
          label="Waiting on technician"
        />
        <FormControlLabel
          value="Waiting on materials"
          control={<Radio />}
          label="Waiting on materials"
        />
        <FormControlLabel
          value="Waiting to be collected"
          control={<Radio />}
          label="Waiting to be collected"
        />
      </RadioGroup>
      <h3>Priority</h3>
      <RadioGroup
        className="radio-group"
        name="controlled-radio-buttons-group"
        value={priority}
        onChange={(e) => {
          setPriority(e.target.value);
          props.setFilters({ status: status, priority: e.target.value });
        }}
      >
        <FormControlLabel value="Low" control={<Radio />} label="Low" />
        <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
        <FormControlLabel value="Urgent" control={<Radio />} label="Urgent" />
      </RadioGroup>
      <Button
        variant="outlined"
        onClick={() => {
          setPriority(null);
          setStatus(null);
          props.setFilters("cleared");
        }}
      >
        Clear All
      </Button>
    </div>
  );
}
