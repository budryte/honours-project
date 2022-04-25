import React, { useEffect, useRef, useState } from "react";
import { Button, Grid, Link, Backdrop, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from "../navbar/Navbar";
import { db } from "../../config/db";
import { useLiveQuery } from "dexie-react-hooks";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import "./home-style.scss";
const XS = 12;
const SM = 12;
const MD = 6;

export default function Home() {
  let navigate = useNavigate();
  const [position, setPosition] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(["", ""]);
  const user = useLiveQuery(() => db.table("users").toCollection().first());

  const handleLogout = async (msg) => {
    await Promise.all([
      getAuth().signOut(),
      db.table("users").toCollection().delete(),
    ]);
    navigate("/");
    alert(msg);
  };

  useEffect(() => {
    if (!position) return;
    if (!position.startsWith("toBeApproved")) {
      setIsLoading(false);
      return;
    }

    setLoadingMsg([
      "Requesting Technician level access...",
      "This usually takes up to 10 seconds",
    ]);

    let isCancelled = false;

    async function checkPosition() {
      const auth = getAuth();
      try {
        const userDoc = (
          await getDoc(doc(getFirestore(), "users", auth.currentUser.uid))
        ).data();

        if (isCancelled || !userDoc) return;

        if (userDoc.position === "toBeApproved") {
          if (position.endsWith("++++")) {
            throw new Error("Timed-out trying to check user's position");
          }

          setTimeout(() => setPosition((prev) => `${prev}+`), 2000);
        } else {
          setPosition(userDoc.position);
          db.table("users").update(user.id, { position: userDoc.position });
        }
      } catch (error) {
        console.warn(error);
        handleLogout(error.message);
      }
    }

    checkPosition();

    return () => (isCancelled = true);
  }, [position]);

  useEffect(() => {
    if (!user) return;

    setPosition(user.position);
    setIsAdmin(user.isAdmin);
  }, [user]);

  let accRef = useRef();
  let reqRef = useRef();
  let trackRef = useRef();
  let arcRef = useRef();
  let workRef = useRef();
  let listRef = useRef();
  let signRef = useRef();
  let techRef = useRef();
  let searchRef = useRef();

  return (
    <div>
      <Backdrop
        open={isLoading}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress size={50} sx={{ marginRight: 2 }} color="inherit" />
        <div>
          <p>{loadingMsg[0]}</p>
          <p>{loadingMsg[1]}</p>
        </div>
      </Backdrop>

      {!isLoading && (
        <>
          <Navbar />
          <main className="box">
            <h1 className="page-title">Dashboard</h1>
            <div className="white-container">
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={XS}
                  md={MD}
                  sm={SM}
                  onClick={() => {
                    navigate("/my-account");
                  }}
                >
                  <div
                    className="card"
                    onMouseOver={() => accRef.current.play()}
                    onMouseLeave={() => accRef.current.stop()}
                  >
                    <Grid container spacing={{ xs: 2 }}>
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
                        <p className="link-to-menu-item para">
                          My Account
                          <ArrowForwardIcon
                            fontSize="small"
                            style={{ marginLeft: "8px" }}
                          />
                        </p>
                        <p>Change your account details</p>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>

                {position !== "Technician" && (
                  <>
                    <Grid
                      item
                      xs={XS}
                      md={MD}
                      sm={SM}
                      onClick={() => {
                        navigate("/agreement");
                      }}
                    >
                      <div
                        className="card"
                        onMouseOver={() => reqRef.current.play()}
                        onMouseLeave={() => reqRef.current.stop()}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={3}>
                            <Player
                              className="spec-animation"
                              ref={reqRef}
                              autoplay={false}
                              loop={false}
                              keepLastFrame
                              src="https://assets8.lottiefiles.com/packages/lf20_65fiagjg.json"
                            />
                          </Grid>
                          <Grid item xs={9}>
                            <p className="link-to-menu-item para">
                              New Request
                              <ArrowForwardIcon
                                fontSize="small"
                                style={{ marginLeft: "8px" }}
                              />
                            </p>
                            <p>Create and send your new request</p>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={XS}
                      md={MD}
                      sm={SM}
                      onClick={() => {
                        navigate("/track-requests");
                      }}
                    >
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
                              className="animation-smaller"
                            />
                          </Grid>
                          <Grid item xs={9}>
                            <p className="link-to-menu-item para">
                              Track Your Requests
                              <ArrowForwardIcon
                                fontSize="small"
                                style={{ marginLeft: "8px" }}
                              />
                            </p>
                            <p>Track your request status</p>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </>
                )}

                {position === "Supervisor" && (
                  <Grid
                    item
                    xs={XS}
                    md={MD}
                    sm={SM}
                    onClick={() => {
                      navigate("/pending-requests");
                    }}
                  >
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
                            className="spec-animation"
                          />
                        </Grid>
                        <Grid item xs={9}>
                          <p className="link-to-menu-item para">
                            Pending Requests
                            <ArrowForwardIcon
                              fontSize="small"
                              style={{ marginLeft: "8px" }}
                            />
                          </p>
                          <p>Approve your pending requests</p>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                )}

                {position === "Technician" && (
                  <>
                    <Grid
                      item
                      xs={XS}
                      md={MD}
                      sm={SM}
                      onClick={() => {
                        navigate("/list-of-requests");
                      }}
                    >
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
                              style={{ width: "70px", heigth: "70px" }}
                            />
                          </Grid>
                          <Grid item xs={9}>
                            <p className="link-to-menu-item para">
                              List of Requests
                              <ArrowForwardIcon
                                fontSize="small"
                                style={{ marginLeft: "8px" }}
                              />
                            </p>
                            <p>View the common list of requests</p>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={XS}
                      md={MD}
                      sm={SM}
                      onClick={() => {
                        navigate("/my-work");
                      }}
                    >
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
                              className="animation-smaller"
                            />
                          </Grid>
                          <Grid item xs={9}>
                            <p className="link-to-menu-item para">
                              My Work
                              <ArrowForwardIcon
                                fontSize="small"
                                style={{ marginLeft: "8px" }}
                              />
                            </p>
                            <p>View your picked up requests</p>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    {isAdmin && (
                      <Grid
                        item
                        xs={XS}
                        md={MD}
                        sm={SM}
                        onClick={() => {
                          navigate("/overview");
                        }}
                      >
                        <div
                          className="card"
                          onMouseOver={() => techRef.current.play()}
                          onMouseLeave={() => techRef.current.stop()}
                        >
                          <Grid container spacing={4}>
                            <Grid item xs={3}>
                              <Player
                                ref={techRef}
                                autoplay={false}
                                loop={false}
                                src="https://assets3.lottiefiles.com/packages/lf20_paqcfdch.json"
                                className="animation-bigger"
                              />
                            </Grid>
                            <Grid item xs={9}>
                              <p className="link-to-menu-item para">
                                Technicians
                                <ArrowForwardIcon
                                  fontSize="small"
                                  style={{ marginLeft: "8px" }}
                                />
                              </p>
                              <p>View and manage technicians</p>
                            </Grid>
                          </Grid>
                        </div>
                      </Grid>
                    )}
                  </>
                )}

                <Grid
                  item
                  xs={XS}
                  md={MD}
                  sm={SM}
                  onClick={() => {
                    navigate("/archive");
                  }}
                >
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
                          className="animation-smaller"
                        />
                      </Grid>
                      <Grid item xs={9}>
                        <p className="link-to-menu-item para">
                          Archive
                          <ArrowForwardIcon
                            fontSize="small"
                            style={{ marginLeft: "8px" }}
                          />
                        </p>
                        <p>
                          {" "}
                          {position === "Technician"
                            ? "View all completed requests in archive"
                            : "View your completed requests in archive"}
                        </p>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>

                {(position === "Supervisor" || position === "Technician") && (
                  <Grid
                    item
                    xs={XS}
                    md={MD}
                    sm={SM}
                    onClick={() => {
                      navigate("/custom-search");
                    }}
                  >
                    <div
                      className="card"
                      onMouseOver={() => searchRef.current.play()}
                      onMouseLeave={() => searchRef.current.stop()}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Player
                            ref={searchRef}
                            autoplay={false}
                            loop={false}
                            src="https://assets4.lottiefiles.com/private_files/lf30_t7oxjwxh.json"
                            className="animation-smaller"
                          />
                        </Grid>
                        <Grid item xs={9}>
                          <p className="link-to-menu-item para">
                            Custom Search
                            <ArrowForwardIcon
                              fontSize="small"
                              style={{ marginLeft: "8px" }}
                            />
                          </p>
                          <p>Search for a specific request</p>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                )}
              </Grid>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
