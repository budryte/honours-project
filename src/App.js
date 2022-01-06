import "./App.css";
import { SignInSignUpContainer } from "./containers/SignInSignUpContainer";
import Home from "./components/home/Home";
import { NewRequestContainer } from "./containers/NewRequestContainer";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/config";
import { useState, useEffect } from "react";
//import "semantic-ui-css/semantic.min.css";
// import { Route, Routes, Navigate } from "react-router-dom";

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
      {user ? <NewRequestContainer /> : <SignInSignUpContainer />}
      {/* <Routes>
        <Route path="/welcome" element={<SignInSignUpContainer />} />
        <Route path="/home" element={<Home />} />
        <Route path="/request" element={<Request />} />
      </Routes> */}
    </div>
  );
}

export default App;
