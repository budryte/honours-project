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
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config/firebaseConfig";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./config/db";
import { useLiveQuery } from "dexie-react-hooks";
import PageNotFound from "./components/error-page/PageNotFound";

initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState("");
  const users = useLiveQuery(() => db.users.toArray());

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

  function whichPosition() {
    let position = "";
    if (users?.length > 0 && users[0].position === "Technician") {
      position = "Technician";
    }
    if (users?.length > 0 && users[0].position === "Supervisor") {
      position = "Supervisor";
    }
    if (users?.length > 0 && users[0].position === "Client") {
      position = "Client";
    }
    return position;
  }

  return (
    <div className="App">
      <Routes>
        {user ? (
          <Route index element={<Home />} />
        ) : (
          <Route index element={<SignInSignUpContainer />} />
        )}
        <Route path="home" element={<Home />} />
        <Route path="my-account" element={<Account />} />
        <Route path="archive" element={<Archive />} />
        <Route path="review-request" element={<ReviewRequest />} />

        {whichPosition() !== "Technician" ? (
          <Route path="agreement" element={<Agreement />} />
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}
        {whichPosition() !== "Technician" ? (
          <Route path="new-request" element={<NewRequestContainer />} />
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}
        {whichPosition() !== "Technician" ? (
          <Route path="track-requests" element={<TrackRequest />} />
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}
        {whichPosition() === "Supervisor" ? (
          <Route path="pending-requests" element={<PendingRequests />} />
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}
        {whichPosition() === "Technician" ? (
          <Route path="list-of-requests" element={<ListofRequests />} />
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}
        {whichPosition() === "Technician" ? (
          <Route path="my-work" element={<MyWork />} />
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}
        {whichPosition() !== "Client" ? (
          <Route path="custom-search" element={<CustomSearch />} />
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}
        {users?.length > 0 && users[0].isAdmin ? (
          <Route path="overview" element={<ListOfTechncians />} />
        ) : (
          <Route path="*" element={<PageNotFound />} />
        )}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
