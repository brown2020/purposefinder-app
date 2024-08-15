import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export const getUserDoc = async (uid: string) => {
  const userRef = doc(db, `users/${uid}/settings/profile`);
  try {
    const doc = await getDoc(userRef);
    return doc.data();
  } catch (e) {
    console.log("Error getting user document:", e);
    return null;
  }
};
