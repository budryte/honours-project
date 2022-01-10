import "./App.css";
import { SignInSignUpContainer } from "./containers/SignInSignUpContainer";
import Home from "./components/home/Home";
import { NewRequestContainer } from "./containers/NewRequestContainer";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/config";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Agreement from "./components/request-form/Agreement";

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
        <Route path="request" element={<NewRequestContainer />} />
        <Route path="agreement" element={<Agreement />} />
        <Route path="request" element={<NewRequestContainer />} />
        {/* <Route path="/track" component={} />
              <Route path="/pending-requests" component={} />
              <Route path="/my-account" component={} />
              <Route path="/archive" component={} />
              <Route path="/list-of-requests" component={} />
              <Route path="/my-work" component={} /> */}
      </Routes>
    </div>
  );
}

export default App;
