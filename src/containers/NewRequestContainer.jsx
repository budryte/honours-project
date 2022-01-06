import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { RequestDetails } from "../components/request-form/RequestDetails";
import { AttachFile } from "../components/request-form/AttachFile";

import "./new-request.scss";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function NewRequestContainer() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="box">
      <div className="page-title">New Request Form</div>
      <div className="card-container">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Details" />
          <Tab label="Attach Files" />
          <Tab label="Review & Send" disabled />
        </Tabs>
        <TabPanel value={value} index={0}>
          <RequestDetails />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AttachFile />
        </TabPanel>
        <TabPanel value={value} index={2}></TabPanel>
      </div>
    </div>
  );
}
