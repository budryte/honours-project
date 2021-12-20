import "./App.css";
import { SignInSignUpContainer } from "./containers";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { NativeBaseProvider } from "native-base";
import { useState, useEffect } from "react";
import Home from "./components/home";
import app from "./firebase/config";

function App() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("turejo prijungti");
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.messae);
            break;
        }
      });
  };

  const handleSignup = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password).catch((err) => {
      switch (err.code) {
        case "auth/email-already-in-use":
        case "auth/invalid-email":
          setEmailError(err.message);
          break;
        case "auth/weak-password":
          setPasswordError(err.messae);
          break;
      }
    });
  };

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
  };

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid);
        setUser(user);
      } else {
        console.log("neprijungiau");
        setUser("");
      }
    });
  }, []);

  return (
    <div className="App">
      {user ? (
        <Home handleLogout={handleLogout}></Home>
      ) : (
        <NativeBaseProvider>
          <SignInSignUpContainer
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            emailError={emailError}
            passwordError={passwordError}
          />
        </NativeBaseProvider>
      )}
    </div>
  );
}

export default App;
