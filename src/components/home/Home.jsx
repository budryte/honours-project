import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from "../navbar/Navbar";
import { db } from "../../config/db";
import { useLiveQuery } from "dexie-react-hooks";

import "./home-style.scss";

export default function Home() {
  let navigate = useNavigate();
  const [position, setPosition] = useState("");
  const users = useLiveQuery(() => db.users.toArray());

  useEffect(() => {
    if (!users || !users[0] || !users[0].position) return;
    setPosition(users[0].position);
  }, [users]);

  let accRef = useRef();
  let reqRef = useRef();
  let trackRef = useRef();
  let arcRef = useRef();
  let workRef = useRef();
  let listRef = useRef();
  let signRef = useRef();

  return (
    <div>
      <Navbar />
      <div className="box">
        <div className="page-title">Technical Request System</div>
        <div className="white-container">
          <div
            className="card"
            onMouseOver={() => accRef.current.play()}
            onMouseLeave={() => accRef.current.stop()}
          >
            <Grid container spacing={{ xs: 2, md: 12 }}>
              <Grid item xs={3}>
                <Player
                  ref={accRef}
                  autoplay={false}
                  loop={false}
                  src="https://assets6.lottiefiles.com/datafiles/PJaBnGmD25lDMgV/data.json"
                  className="animation-smaller"
                />
              </Grid>
              <Grid item xs={9}>
                <h3>My Account</h3>
                <p>Change your account details</p>
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate("/my-account");
                  }}
                >
                  My Account
                </Button>
              </Grid>
            </Grid>
          </div>
          {position !== "Technician" && (
            <div
              className="card"
              onMouseOver={() => reqRef.current.play()}
              onMouseLeave={() => reqRef.current.stop()}
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Player
                    className="animation"
                    ref={reqRef}
                    autoplay={false}
                    loop={false}
                    keepLastFrame
                    src="https://assets8.lottiefiles.com/packages/lf20_65fiagjg.json"
                  />
                </Grid>
                <Grid item xs={9}>
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
                </Grid>
              </Grid>
            </div>
          )}
          {position !== "Technician" && (
            <div
              className="card"
              onMouseOver={() => trackRef.current.play()}
              onMouseLeave={() => trackRef.current.stop()}
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Player
                    ref={trackRef}
                    autoplay={false}
                    loop={false}
                    src="https://assets3.lottiefiles.com/packages/lf20_C1giXF.json"
                    className="animation"
                  />
                </Grid>
                <Grid item xs={9}>
                  <h3>Track Requests</h3>
                  <p>Track your request status</p>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/track-requests");
                    }}
                  >
                    Track Requests
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
          {position === "Supervisor" && (
            <div
              className="card"
              onMouseOver={() => signRef.current.play()}
              onMouseLeave={() => signRef.current.stop()}
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Player
                    ref={signRef}
                    autoplay={false}
                    loop={false}
                    keepLastFrame
                    src="https://assets10.lottiefiles.com/packages/lf20_s3u31uyq.json"
                    className="animation"
                  />
                </Grid>
                <Grid item xs={9}>
                  <h3>Pending Requests</h3>
                  <p>Approve your pending requests</p>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/pending-requests");
                    }}
                  >
                    Pending Requests
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
          {position === "Technician" && (
            <div
              className="card"
              onMouseOver={() => listRef.current.play()}
              onMouseLeave={() => listRef.current.stop()}
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Player
                    ref={listRef}
                    autoplay={false}
                    loop={false}
                    src="https://assets1.lottiefiles.com/packages/lf20_2LMpmD.json"
                    className="animation-smaller"
                  />
                </Grid>
                <Grid item xs={9}>
                  <h3>List of Requests</h3>
                  <p>View the list of requests</p>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/list-of-requests");
                    }}
                  >
                    List of Requests
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
          {position === "Technician" && (
            <div
              className="card"
              onMouseOver={() => workRef.current.play()}
              onMouseLeave={() => workRef.current.stop()}
            >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Player
                    ref={workRef}
                    autoplay={false}
                    loop={false}
                    src="https://assets8.lottiefiles.com/packages/lf20_9zrznuec.json"
                    className="animation"
                  />
                </Grid>
                <Grid item xs={9}>
                  <h3>My Work</h3>
                  <p>View your tasks</p>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/my-work");
                    }}
                  >
                    My Work
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
          <div
            className="card"
            onMouseOver={() => arcRef.current.play()}
            onMouseLeave={() => arcRef.current.stop()}
          >
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Player
                  ref={arcRef}
                  autoplay={false}
                  loop={false}
                  src="https://assets1.lottiefiles.com/packages/lf20_fx7Gm7.json"
                  className="animation"
                />
              </Grid>
              <Grid item xs={9}>
                <h3>Archive</h3>
                <p>View archive</p>
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate("/archive");
                  }}
                >
                  Archive
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}
