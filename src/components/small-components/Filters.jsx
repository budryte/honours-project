import React, { useState, useEffect } from "react";
import {
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
  Button,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Filters(props) {
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [sortingType, setSortingType] = useState("newest last");
  const matches = useMediaQuery("(min-width:1000px)");

  useEffect(() => {
    setExpanded(matches);
  }, [matches]);

  const [expanded, setExpanded] = useState(matches);

  return (
    <div>
      <Accordion expanded={expanded} onChange={() => setExpanded((p) => !p)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2
            style={{
              fontSize: "20px",
              fontFamily: "Baxter Sans Bold",
              margin: 0,
            }}
          >
            Filters
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <h3 style={{ textDecoration: "underline", marginTop: 0 }}>
            Sort by:
          </h3>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 180 }}>
            <Select
              style={{ padding: 0, width: 160 }}
              labelId="sort-by"
              id="sort-by"
              aria-labelledby="sort-by"
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
          <h3 style={{ textDecoration: "underline" }}>Filter by:</h3>
          <fieldset style={{ paddingBottom: 0 }}>
            <legend>Status</legend>
            <RadioGroup
              className="radio-group"
              name="controlled-radio-buttons-group-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                props.setFilters({
                  status: e.target.value,
                  priority: priority,
                });
              }}
            >
              <FormControlLabel
                style={{ padding: 0 }}
                value="Pending approval"
                control={<Radio size="small" />}
                label="Pending approval"
              />
              <FormControlLabel
                value="In progress"
                control={<Radio size="small" />}
                label="In progress"
              />
              <FormControlLabel
                value="Waiting on technician"
                control={<Radio size="small" />}
                label="Waiting on technician"
              />
              <FormControlLabel
                value="Waiting on materials"
                control={<Radio size="small" />}
                label="Waiting on materials"
              />
              <FormControlLabel
                value="Waiting to be collected"
                control={<Radio size="small" />}
                label="Waiting to be collected"
              />
            </RadioGroup>
          </fieldset>
          <fieldset style={{ marginTop: "10px", paddingBottom: 0 }}>
            <legend>Priority</legend>
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
              }}
            >
              <FormControlLabel
                value="Low"
                control={<Radio size="small" />}
                label="Low"
              />
              <FormControlLabel
                value="Medium"
                control={<Radio size="small" />}
                label="Medium"
              />
              <FormControlLabel
                value="Urgent"
                control={<Radio size="small" />}
                label="Urgent"
              />
            </RadioGroup>
          </fieldset>
          <Button
            style={{ marginTop: "15px" }}
            variant="outlined"
            onClick={() => {
              setPriority(null);
              setStatus(null);
              props.setFilters("cleared");
            }}
          >
            Clear All Filters
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
