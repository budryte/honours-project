import "./App.css";
import { SignInSignUpContainer } from "./containers/SignInSignUpContainer";
import Home from "./components/home/Home";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/config";
import { useState, useEffect } from "react";

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
      {user ? <Home></Home> : <SignInSignUpContainer />}
    </div>
  );
}

export default App;
