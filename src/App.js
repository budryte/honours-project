import "./App.css";
import React, { useState, useEffect } from "react";
import { SignInSignUpContainer } from "./containers/SignInSignUpContainer";
import { NewRequestContainer } from "./containers/NewRequestContainer";
import Home from "./components/home/Home";
import Agreement from "./components/request-form/Agreement";
import TrackRequest from "./components/track-request/TrackRequest";
import PendingRequests from "./components/pending-requests/PendingRequests";
import ListofRequests from "./components/list-of-requests/ListOfRequests";
import MyWork from "./components/technician-work/MyWork";
import Archive from "./components/archive/Archive";
import ReviewRequest from "./containers/ReviewRequest";
import Account from "./components/my-account/Account";
import ListOfTechncians from "./components/overview/ListOfTechnicians";
import CustomSearch from "./components/custom-search/CustomSearch";
import AboutPage from "./components/about-page/AboutPage";
import { initializeApp } from "firebase/app";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./config/db";
import { useLiveQuery } from "dexie-react-hooks";
import PageNotFound from "./components/error-page/PageNotFound";

if (process.env.REACT_APP_FIREBASE_CONFIG)
  initializeApp(JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG));
else console.warn("Could not find the firebase config");

function App() {
  const [user, setUser] = useState("");
  const localUser = useLiveQuery(() =>
    db.table("users").toCollection().first()
  );
  const isAdmin = localUser?.isAdmin ?? false;
  const position = localUser?.position ?? "";

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser("");
      }
    });
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "img/bg.jpg"})`,
      }}
      className="App"
    >
      <Routes>
        {user ? (
          <Route index element={<Home />} />
        ) : (
          <Route index element={<SignInSignUpContainer />} />
        )}
        <Route path="my-account" element={<Account />} />
        <Route path="archive" element={<Archive />} />
        <Route path="review-request" element={<ReviewRequest />} />
        <Route path="about" element={<AboutPage />} />

        {position !== "Technician" && (
          <>
            <Route path="agreement" element={<Agreement />} />
            <Route path="new-request" element={<NewRequestContainer />} />
            <Route path="track-requests" element={<TrackRequest />} />
          </>
        )}
        {position === "Supervisor" && (
          <>
            <Route path="pending-requests" element={<PendingRequests />} />
            <Route path="custom-search" element={<CustomSearch />} />
          </>
        )}
        {position === "Technician" && (
          <>
            <Route path="list-of-requests" element={<ListofRequests />} />
            <Route path="my-work" element={<MyWork />} />
            <Route path="custom-search" element={<CustomSearch />} />
          </>
        )}
        {isAdmin && <Route path="overview" element={<ListOfTechncians />} />}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
