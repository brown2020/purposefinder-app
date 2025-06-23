import { auth } from "@/lib/firebase/firebaseConfig";
import { getIdToken } from "firebase/auth";

export async function getCurrentUserIdToken() {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated");
  }

  try {
    const idToken = await getIdToken(auth.currentUser);
    return idToken;
  } catch (error) {
    console.error("Error fetching ID token:", error);
    throw error;
  }
}
