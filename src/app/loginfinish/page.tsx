"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { useProfile } from "@/stores";

export default function LoginFinishPage() {
  const router = useRouter();
  const setAuthDetails = useAuthStore((s) => s.setAuthDetails);
  const { updateProfile } = useProfile();

  useEffect(() => {
    async function attemptSignIn() {
      try {
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          throw new Error("Sign in link is not valid");
        }

        let email = window.localStorage.getItem("purposefinderEmail");
        const name = window.localStorage.getItem("purposefinderName") || "";
        const offersOptIn =
          window.localStorage.getItem("purposefinderOffersOptIn") ===
          "Accepted";

        console.log("User signed in successfully:", email, name, offersOptIn);
        if (!email) {
          email = window.prompt("Please confirm your email");
          if (!email) {
            throw new Error("Email confirmation cancelled by user");
          }
        }

        const userCredential = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );

        const user = userCredential.user;
        const authEmail = user?.email;
        const uid = user?.uid;
        const selectedName = name || user?.displayName || "";

        console.log(
          "User auth data:",
          authEmail,
          uid,
          selectedName,
          offersOptIn
        );

        if (!uid || !authEmail) {
          throw new Error("No user found");
        }

        console.log(
          "User signed in successfully:",
          authEmail,
          uid,
          selectedName
        );

        setAuthDetails({
          uid,
          authEmail,
          selectedName,
          offersOptIn,
        });
        updateProfile({ firstName: selectedName });
      } catch (error) {
        let errorMessage = "Unknown error signing in";
        if (error instanceof FirebaseError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        console.log("ERROR", errorMessage);
        alert(errorMessage);
      } finally {
        window.localStorage.removeItem("purposefinderEmail");
        window.localStorage.removeItem("purposefinderName");
        window.localStorage.removeItem("purposefinderOffersOptIn");
        router.replace("/introduction");
      }
    }

    attemptSignIn();
  }, [router, setAuthDetails, updateProfile]);
}
