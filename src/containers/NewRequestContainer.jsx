import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { RequestDetails } from "../components/request-form/RequestDetails";
import { AttachFile } from "../components/request-form/AttachFile";
import { ReviewAndSend } from "../components/request-form/ReviewAndSend";
import Navbar from "../components/navbar/Navbar";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
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
  const [details, setDetails] = useState(null);
  const [extraInfo, setExtraInfo] = useState("");
  const [linkToFolder, setLinkToFolder] = useState(null);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Navbar />
      <main className="box">
        <h1 className="page-title">New Request Form</h1>
        <div className="white-container">
          <Tabs value={value} onChange={handleChange}>
            <Tab
              label="Details"
              style={{ fontSize: "18px", fontFamily: "Baxter Sans Regular" }}
            />
            <Tab
              label="Attach Files"
              style={{ fontSize: "18px", fontFamily: "Baxter Sans Regular" }}
              disabled={
                details === null ||
                details.discipline === undefined ||
                (details.discipline === "Other" &&
                  details.otherDiscipline === undefined) ||
                details.projectType === undefined ||
                (details.projectType === "Other" &&
                  details.otherProjectType === undefined) ||
                details.priority === undefined ||
                details.supervisor === undefined ||
                details.approvalRequired === undefined ||
                (details.approvalRequired === "No" &&
                  details.account === undefined)
              }
            />
            <Tab
              label="Review & Send"
              style={{ fontSize: "18px", fontFamily: "Baxter Sans Regular" }}
              disabled={extraInfo === ""}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <RequestDetails
              handleChange={handleChange}
              details={details}
              setDetails={setDetails}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AttachFile
              handleChange={handleChange}
              extraInfo={extraInfo}
              setExtraInfo={setExtraInfo}
              linkToFolder={linkToFolder}
              setLinkToFolder={setLinkToFolder}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ReviewAndSend
              handleChange={handleChange}
              extraInfo={extraInfo}
              linkToFolder={linkToFolder}
              details={details}
            />
          </TabPanel>
        </div>
      </main>
    </div>
  );
}
