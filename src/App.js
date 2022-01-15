import "./App.css";
import { SignInSignUpContainer } from "./containers/SignInSignUpContainer";
import { NewRequestContainer } from "./containers/NewRequestContainer";
import Home from "./components/home/Home";
import Agreement from "./components/request-form/Agreement";
import TrackRequest from "./components/track-request/TrackRequest";
import PendingRequests from "./components/pending-requests/PendingRequests";
import ReviewPendingRequest from "./components/pending-requests/ReviewPendingRequest";
import ListofRequests from "./components/list-of-requests/ListOfRequests";
import PickUpRequest from "./components/list-of-requests/PickUpRequest";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/config";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (currectUser) => {
      if (currectUser) {
        setUser(currectUser);
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
        <Route path="agreement" element={<Agreement />} />
        <Route path="new-request" element={<NewRequestContainer />} />
        <Route path="track-request" element={<TrackRequest />} />
        <Route path="pending-requests" element={<PendingRequests />} />
        <Route
          path="review-pending-request"
          element={<ReviewPendingRequest />}
        />
        <Route path="list-of-requests" element={<ListofRequests />} />
        <Route path="pick-up-request" element={<PickUpRequest />} />
        {/* <Route path="/my-account" component={} />
              <Route path="/archive" component={} />
              <Route path="/my-work" component={} /> */}
      </Routes>
    </div>
  );
}

export default App;
