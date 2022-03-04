import { getFirestore, getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function initPosition() {
  const db = getFirestore();
  const auth = getAuth();
  const docRef = doc(db, "users", auth.currentUser.uid);
  return getDoc(docRef);
}

export const REQUESTS_PER_PAGE = 8;
