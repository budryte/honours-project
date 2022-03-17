import React, { useEffect, useRef, useState } from "react";
import { Button, Grid, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from "../navbar/Navbar";
import { db } from "../../config/db";
import { useLiveQuery } from "dexie-react-hooks";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import "./home-style.scss";
const XS = 12;
const SM = 12;
const MD = 6;

export default function Home() {
  let navigate = useNavigate();
  const [position, setPosition] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const users = useLiveQuery(() => db.users.toArray());

  useEffect(() => {
    if (!users || !users[0] || !users[0].position) return;
    setPosition(users[0].position);
    setIsAdmin(users[0].isAdmin);
  }, [users]);

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
      <Navbar />
      <main className="box">
        <h1 className="page-title">Technical Request System</h1>
        <div className="white-container">
          <Grid container spacing={2}>
            <Grid item xs={XS} md={MD} sm={SM}>
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
                  <Grid
                    item
                    xs={9}
                    onClick={() => {
                      navigate("/my-account");
                    }}
                  >
                    <p
                      className="link-to-menu-item para"
                      onClick={() => {
                        navigate("/my-account");
                      }}
                    >
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
              <Grid item xs={XS} md={MD} sm={SM}>
                <div
                  className="card"
                  onMouseOver={() => reqRef.current.play()}
                  onMouseLeave={() => reqRef.current.stop()}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Player
                        className="animation-bigger"
                        ref={reqRef}
                        autoplay={false}
                        loop={false}
                        keepLastFrame
                        src="https://assets8.lottiefiles.com/packages/lf20_65fiagjg.json"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      onClick={() => {
                        navigate("/agreement");
                      }}
                    >
                      <p
                        className="link-to-menu-item para"
                        onClick={() => {
                          navigate("/agreement");
                        }}
                      >
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
            )}

            {position !== "Technician" && (
              <Grid item xs={XS} md={MD} sm={SM}>
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
                    <Grid
                      item
                      xs={9}
                      onClick={() => {
                        navigate("/track-requests");
                      }}
                    >
                      <p
                        className="link-to-menu-item para"
                        onClick={() => {
                          navigate("/track-requests");
                        }}
                      >
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
            )}

            {position === "Supervisor" && (
              <Grid item xs={XS} md={MD} sm={SM}>
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
                        className="animation-bigger"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      onClick={() => {
                        navigate("/pending-requests");
                      }}
                    >
                      <p
                        className="link-to-menu-item para"
                        onClick={() => {
                          navigate("/pending-requests");
                        }}
                      >
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
              <Grid item xs={XS} md={MD} sm={SM}>
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
                    <Grid
                      item
                      xs={9}
                      onClick={() => {
                        navigate("/list-of-requests");
                      }}
                    >
                      <p
                        className="link-to-menu-item para"
                        onClick={() => {
                          navigate("/list-of-requests");
                        }}
                      >
                        List of Requests
                        <ArrowForwardIcon
                          fontSize="small"
                          style={{ marginLeft: "8px" }}
                        />
                      </p>
                      <p>View the list of requests</p>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            )}

            {position === "Technician" && (
              <Grid item xs={XS} md={MD} sm={SM}>
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
                    <Grid
                      item
                      xs={9}
                      onClick={() => {
                        navigate("/my-work");
                      }}
                    >
                      <p
                        className="link-to-menu-item para"
                        onClick={() => {
                          navigate("/my-work");
                        }}
                      >
                        My Work
                        <ArrowForwardIcon
                          fontSize="small"
                          style={{ marginLeft: "8px" }}
                        />
                      </p>
                      <p>View your tasks</p>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            )}

            {position === "Technician" && !!isAdmin ? (
              <Grid item xs={XS} md={MD} sm={SM}>
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
                    <Grid
                      item
                      xs={9}
                      onClick={() => {
                        navigate("/overview");
                      }}
                    >
                      <p
                        className="link-to-menu-item para"
                        onClick={() => {
                          navigate("/overview");
                        }}
                      >
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
            ) : undefined}

            <Grid item xs={XS} md={MD} sm={SM}>
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
                  <Grid
                    item
                    xs={9}
                    onClick={() => {
                      navigate("/archive");
                    }}
                  >
                    <p
                      className="link-to-menu-item para"
                      onClick={() => {
                        navigate("/archive");
                      }}
                    >
                      Archive
                      <ArrowForwardIcon
                        fontSize="small"
                        style={{ marginLeft: "8px" }}
                      />
                    </p>
                    <p>View archive</p>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            {position !== "Client" && (
              <Grid item xs={XS} md={MD} sm={SM}>
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
                    <Grid
                      item
                      xs={9}
                      onClick={() => {
                        navigate("/custom-search");
                      }}
                    >
                      <p
                        className="link-to-menu-item para"
                        onClick={() => {
                          navigate("/custom-search");
                        }}
                      >
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
    </div>
  );
}
