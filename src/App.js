import "./App.css";
import React, { useState, useEffect } from "react";
import { SignInSignUpContainer } from "./containers/SignInSignUpContainer";
import { NewRequestContainer } from "./containers/NewRequestContainer";
import Home from "./components/home/Home";
import Agreement from "./components/request-form/Agreement";
import TrackRequest from "./components/track-request/TrackRequest";
import ReviewRequest from "./components/track-request/ReviewRequest";
import PendingRequests from "./components/pending-requests/PendingRequests";
import ReviewPendingRequest from "./components/pending-requests/ReviewPendingRequest";
import ListofRequests from "./components/list-of-requests/ListOfRequests";
import PickUpRequest from "./components/list-of-requests/PickUpRequest";
import MyWork from "./components/technician-work/MyWork";
import Archive from "./components/archive/Archive";
import ReviewArchivedRequest from "./components/archive/ReviewArchivedRequest";
import Account from "./components/my-account/Account";
import ListOfTechncians from "./components/overview/ListOfTechnicians";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config/firebaseConfig";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./config/db";
import { useLiveQuery } from "dexie-react-hooks";

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
        <Route path="agreement" element={<Agreement />} />
        <Route path="new-request" element={<NewRequestContainer />} />
        <Route path="track-requests" element={<TrackRequest />} />
        <Route path="review-request" element={<ReviewRequest />} />
        <Route path="pending-requests" element={<PendingRequests />} />
        <Route
          path="review-pending-request"
          element={<ReviewPendingRequest />}
        />
        <Route path="list-of-requests" element={<ListofRequests />} />
        <Route path="pick-up-request" element={<PickUpRequest />} />
        <Route path="my-work" element={<MyWork />} />
        <Route path="archive" element={<Archive />} />
        <Route
          path="review-archived-request"
          element={<ReviewArchivedRequest />}
        />
        {users?.length > 0 && users[0].isAdmin && (
          <Route path="overview" element={<ListOfTechncians />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
