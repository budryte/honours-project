import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from "../navbar/Navbar";

import "./home-style.scss";

export default function Home() {
  const [position, setPosition] = useState("");

  let navigate = useNavigate();

  let accRef = useRef();
  let reqRef = useRef();
  let trackRef = useRef();
  let arcRef = useRef();
  let workRef = useRef();
  let listRef = useRef();
  let signRef = useRef();

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
    <div>
      <Navbar position={position} />
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
                    src="https://assets6.lottiefiles.com/datafiles/PJaBnGmD25lDMgV/data.json"
                    className="animation-smaller"
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
                      className="animation"
                      ref={reqRef}
                      autoplay={false}
                      loop={false}
                      keepLastFrame
                      src="https://assets8.lottiefiles.com/packages/lf20_65fiagjg.json"
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
                      loop={false}
                      src="https://assets3.lottiefiles.com/packages/lf20_C1giXF.json"
                      className="animation"
                    />
                    <h3>Track Requests</h3>
                    <p>Track your request status</p>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        navigate("/track-request");
                      }}
                    >
                      Track Requests
                    </Button>
                  </div>
                </Grid>
              )}
              {position === "Supervisor" && (
                <Grid item xs={6} md={6}>
                  <div
                    className="card"
                    onMouseOver={() => signRef.current.play()}
                    onMouseLeave={() => signRef.current.stop()}
                  >
                    <Player
                      ref={signRef}
                      autoplay={false}
                      loop={false}
                      keepLastFrame
                      src="https://assets10.lottiefiles.com/packages/lf20_s3u31uyq.json"
                      className="animation"
                    />
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
                  </div>
                </Grid>
              )}
              {position === "Technician" && (
                <Grid item xs={6} md={6}>
                  <div
                    className="card"
                    onMouseOver={() => listRef.current.play()}
                    onMouseLeave={() => listRef.current.stop()}
                  >
                    <Player
                      ref={listRef}
                      autoplay={false}
                      loop={false}
                      src="https://assets1.lottiefiles.com/packages/lf20_2LMpmD.json"
                      className="animation-smaller"
                    />
                    <h3>List of Requests</h3>
                    <p>View the list of requets</p>
                    <Button variant="outlined">List of Requets</Button>
                  </div>
                </Grid>
              )}
              {position === "Technician" && (
                <Grid item xs={6} md={6}>
                  <div
                    className="card"
                    onMouseOver={() => workRef.current.play()}
                    onMouseLeave={() => workRef.current.stop()}
                  >
                    <Player
                      ref={workRef}
                      autoplay={false}
                      loop={false}
                      src="https://assets8.lottiefiles.com/packages/lf20_9zrznuec.json"
                      className="animation"
                    />
                    <h3>My Work</h3>
                    <p>View your tasks</p>
                    <Button variant="outlined">My Work</Button>
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
                    className="animation"
                  />
                  <h3>Archive</h3>
                  <p>View archive</p>
                  <Button variant="outlined">Archive</Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}
