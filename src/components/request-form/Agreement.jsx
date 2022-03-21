import React, { useState } from "react";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";

import "./request-form-style.scss";
import { List, ListItemText } from "@mui/material";

export default function Agreement() {
  const [agreementChecked, setAgreementChecked] = useState(false);

  let navigate = useNavigate();

  const handleChange = (event) => {
    setAgreementChecked(event.target.checked);
  };

  return (
    <div>
      <Navbar />
      <main className="box">
        <h1 className="page-title">Guidelines</h1>
        <div className="white-container-account">
          <h2>Request for Technical Assistance Guidelines</h2>
          <List>
            <ListItemText className="list-item">
              1. The Request for Technical Assistance form (RTA) should be
              completed and submitted with appropriate drawings and/or
              information. Please ensure that an email address is included in
              order that you can be contacted. Please also include details of a
              Supervisor (who should approve and sign the request) and account
              number which will be required should materials need to be bought.
            </ListItemText>
            <br></br>
            <ListItemText className="list-item">
              2. On submission of the form, an RTA number will be assigned to
              your request and your job will join the queue with others already
              in the system.
            </ListItemText>
            <br></br>
            <ListItemText className="list-item">
              3. The status of technical requests can be viewed on the Track
              Your Requests Page.
            </ListItemText>
            <br></br>
            <ListItemText className="list-item">
              4. The technicians endeavour to operate as fair a system as
              possible to everyone by working through them in a timely manner.
              Those putting requests in should therefore show due consideration
              with regards to other jobs in the system before theirs. Please be
              aware that there are some times of the year however when certain
              requests are given priority in the system, typically those related
              to Honours project work. It is advisable to submit workshop
              requests as soon as you can as no guarantee can be given for a job
              to be completed by a deadline should there be several jobs already
              in the system that are being worked through.
            </ListItemText>
            <br></br>
            <ListItemText className="list-item">
              5. Please also note that some jobs may be started before others
              depending on factors such as, the nature of the request,
              availability of certain technicians or machinery, anticipated time
              to complete a request (particularly shorter jobs which might be
              able to be completed in between waiting time with others).
            </ListItemText>
            <br></br>
            <ListItemText className="list-item">
              6. Please note that when requesting items to be made, it is often
              considerably easier and less time consuming to make several of the
              same part at the same time than to just make 1 part and then be
              asked at a later date for several more. A great deal of technician
              time can be taken in setting machinery up and it is more effective
              to run several items off at this stage. Any requests for
              subsequent identical or similar items, that were not indicated in
              the original RTA are very likely to be put at the end of the queue
              in order to be fair to all those with requests in the system.
            </ListItemText>
            <br></br>
            <ListItemText className="list-item">
              7. Please also note that when submitting a request, as far as
              possible the complete nature of the request should be given. It is
              very frustrating for technicians and not considerate for others
              waiting for their jobs to be started when requestors return on
              several occasions after their job is complete asking for
              additional work to be done. Please note that under these
              circumstances, this additional work may be made to join the end of
              the queue to be fair to others and the technicians.
            </ListItemText>
            <br></br>
            <ListItemText className="list-item">
              8. Additionally, technicians may communicate via email for
              information that is important to be able to continue with the
              task. Please note that due consideration has to be given to others
              who are waiting in the system and if no response to a
              communication is made then your request may be stopped and put on
              hold until that information is received and a different request
              then started.
            </ListItemText>
            <br></br>
            <ListItemText>
              <b>Dr Gary J Callon, Technical Manager</b>
            </ListItemText>
          </List>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={agreementChecked} onChange={handleChange} />
              }
              label="Agree to Guidelines"
            />
          </FormGroup>
          <div className="buttons">
            <Button
              disabled={!agreementChecked}
              variant="outlined"
              onClick={() => {
                navigate("/new-request");
              }}
            >
              Create New Request
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
