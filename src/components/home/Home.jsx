import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";

import "./home-style.scss";

export default function Home() {
  const [position, setPosition] = useState("");

  let navigate = useNavigate();

  let accRef = useRef();
  let reqRef = useRef();
  let trackRef = useRef();
  let arcRef = useRef();

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
              <div
                className="card"
                onMouseOver={() => accRef.current.play()}
                onMouseLeave={() => accRef.current.stop()}
              >
                <Player
                  ref={accRef}
                  autoplay={false}
                  loop={false}
                  src="https://assets1.lottiefiles.com/packages/lf20_mr1kkmr2.json"
                  style={{
                    height: "150px",
                    width: "250px",
                  }}
                />
                <h3>My Account</h3>
                <p>Change your account details</p>
                <Button variant="outlined">My Account</Button>
              </div>
            </Grid>

            {position !== "Technician" && (
              <Grid item xs={6} md={6}>
                <div
                  className="card"
                  onMouseOver={() => reqRef.current.play()}
                  onMouseLeave={() => reqRef.current.stop()}
                >
                  <Player
                    ref={reqRef}
                    autoplay={false}
                    loop={false}
                    keepLastFrame
                    src="https://assets8.lottiefiles.com/packages/lf20_65fiagjg.json"
                    style={{
                      height: "150px",
                      width: "250px",
                    }}
                  />
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
                <div
                  className="card"
                  onMouseOver={() => trackRef.current.play()}
                  onMouseLeave={() => trackRef.current.stop()}
                >
                  <Player
                    ref={trackRef}
                    autoplay={false}
                    loop
                    src="https://assets7.lottiefiles.com/packages/lf20_xbf1be8x.json"
                    style={{
                      height: "150px",
                      width: "250px",
                    }}
                  />
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
              <div
                className="card"
                onMouseOver={() => arcRef.current.play()}
                onMouseLeave={() => arcRef.current.stop()}
              >
                <Player
                  ref={arcRef}
                  autoplay={false}
                  loop={false}
                  src="https://assets1.lottiefiles.com/packages/lf20_fx7Gm7.json"
                  style={{
                    height: "150px",
                    width: "250px",
                  }}
                />
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
          <Button variant="contained" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
