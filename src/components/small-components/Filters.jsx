import React, { useState } from "react";
import {
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

export default function Filters(props) {
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [sortingType, setSortingType] = useState("newest last");

  return (
    <div>
      <h3>Sort by:</h3>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 180 }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={sortingType}
          onChange={(e) => {
            setSortingType(e.target.value);
            props.setSorting({ sortingType: e.target.value });
          }}
        >
          <MenuItem value={"newest last"}>Oldest</MenuItem>
          <MenuItem value={"newest first"}>Newest</MenuItem>
        </Select>
      </FormControl>
      <h2>Filter by:</h2>
      <h3>Status</h3>
      <RadioGroup
        className="radio-group"
        name="controlled-radio-buttons-group"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          props.setFilters({
            status: e.target.value,
            priority: priority,
          });
          props.setSorting({ sortingType: sortingType });
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
          props.setFilters({
            status: status,
            priority: e.target.value,
          });
          props.setSorting({ sortingType: sortingType });
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
        Clear All Filters
      </Button>
    </div>
  );
}
