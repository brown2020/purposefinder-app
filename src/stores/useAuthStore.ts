import { db } from "@/lib/firebase/firebaseConfig";
import { Timestamp, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { create } from "zustand";

export interface AuthState {
  uid: string;
  authEmail: string;
  authDisplayName: string;
  authPhotoUrl: string;
  authEmailVerified: boolean;
  authReady: boolean;
  authPending: boolean;
  isAllowed: boolean;
  lastSignIn: Timestamp | null;
  offersOptIn: boolean;
  selectedName: string;
  premium: boolean;
}

interface AuthActions {
  setAuthDetails: (details: Partial<AuthState>) => void;
  clearAuthDetails: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  uid: "",
  authEmail: "",
  authDisplayName: "",
  authPhotoUrl: "",
  authEmailVerified: false,
  authReady: false,
  authPending: false,
  isAllowed: false,
  lastSignIn: null,
  offersOptIn: false,
  selectedName: "",
  premium: false,

  setAuthDetails: async (details: Partial<AuthState>) => {
    const { ...oldState } = get();
    const newState = { ...oldState, ...details };

    // Only include serializable fields for Firestore
    const {
      uid,
      authEmail,
      authDisplayName,
      authPhotoUrl,
      authEmailVerified,
      authReady,
      authPending,
      isAllowed,
      lastSignIn,
      offersOptIn,
      selectedName,
      premium,
    } = newState;

    const serializableDetails = {
      uid,
      authEmail,
      authDisplayName,
      authPhotoUrl,
      authEmailVerified,
      authReady,
      authPending,
      isAllowed,
      lastSignIn,
      offersOptIn,
      selectedName,
      premium,
    };

    set(newState);
    await updateUserDetailsInFirestore(serializableDetails, uid);
  },

  clearAuthDetails: () =>
    set({
      uid: "",
      authEmail: "",
      authDisplayName: "",
      authPhotoUrl: "",
      authEmailVerified: false,
      authReady: false,
      authPending: false,
      isAllowed: false,
      lastSignIn: null,
      offersOptIn: false,
      selectedName: "",
      premium: false,
    }),
}));

async function updateUserDetailsInFirestore(
  details: Partial<AuthState>,
  uid: string
) {
  if (uid) {
    const userRef = doc(db, `users/${uid}`);

    try {
      await setDoc(
        userRef,
        { ...details, lastSignIn: serverTimestamp() },
        { merge: true }
      );
      console.log("Auth details updated successfully in Firestore.");
    } catch (error) {
      console.error("Error updating auth details in Firestore:", error);
    }
  }
}
