import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import { Link, useNavigate } from "react-router-dom";
import { NewRequestContainer } from "../../containers/NewRequestContainer";

import "./home-style.scss";

export default function Home() {
  const [position, setPosition] = useState("");

  let navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
  };

  useEffect(() => {
    getPosition();
  }, []);

  async function getPosition() {
    const db = getFirestore();
    const auth = getAuth();
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    setPosition(docSnap.data().position);
  }

  return (
    <div className="box">
      <div className="page-title">Technical Request System</div>
      <div className="menu">
        <div className="card-container">
          <Grid
            container
            spacing={{ xs: 1, md: 2 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={6} md={6}>
              <div className="card">
                <h3>My Account</h3>
                <p>Change your account details</p>
                <Button variant="outlined">My Account</Button>
              </div>
            </Grid>

            {position !== "Technician" && (
              <Grid item xs={6} md={6}>
                <div className="card">
                  <h3>New Request</h3>
                  <p>Create and send your new request</p>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/agreement");
                    }}
                  >
                    New Request
                  </Button>
                </div>
              </Grid>
            )}
            {position !== "Technician" && (
              <Grid item xs={6} md={6}>
                <div className="card">
                  <h3>Track Requests</h3>
                  <p>Track your request status</p>
                  <Button variant="outlined">Track Requests</Button>
                </div>
              </Grid>
            )}
            {position === "Supervisor" && (
              <Grid item xs={6} md={6}>
                <div className="card">
                  <h3>Pending Requests</h3>
                  <p>Approve your pending requests</p>
                  <Button variant="outlined">Pending Requests</Button>
                </div>
              </Grid>
            )}
            <Grid item xs={6} md={6}>
              <div className="card">
                <h3>Archive</h3>
                <p>View archive</p>
                <Button variant="outlined">Archive</Button>
              </div>
            </Grid>
            {position === "Technician" && (
              <Grid item xs={6} md={6}>
                <div className="card">
                  <h3>List of Requests</h3>
                  <p>View the list of requets</p>
                  <Button variant="outlined">List of Requets</Button>
                </div>
              </Grid>
            )}
            {position === "Technician" && (
              <Grid item xs={6} md={6}>
                <div className="card">
                  <h3>My Work</h3>
                  <p>View your tasks</p>
                  <Button variant="outlined">My Work</Button>
                </div>
              </Grid>
            )}
          </Grid>
        </div>
        {/* <Button variant="contained" onClick={handleLogout}>
          Sign Out
        </Button> */}
      </div>
    </div>
  );
}
