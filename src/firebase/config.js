import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGgotvPNazjBMaia_0WVqI4dDqq1qZlkQ",
  authDomain: "request-management-syste-cba73.firebaseapp.com",
  projectId: "request-management-syste-cba73",
  storageBucket: "request-management-syste-cba73.appspot.com",
  messagingSenderId: "763320755471",
  appId: "1:763320755471:web:c8cdf3fcd480ce8070ca7a",
  measurementId: "G-SBZXL34E1H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const projectFirestore = firebase.firestore();
const projectStorage = firebase.storage();

export { projectFirestore, projectStorage };
