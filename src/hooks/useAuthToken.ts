import { useCallback, useEffect, useState } from "react";
import { getIdToken } from "firebase/auth";
import { deleteCookie, setCookie } from "cookies-next";
import { debounce } from "lodash";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { auth } from "@/firebase/firebaseConfig";

let renderCount = 0;

const useAuthToken = (cookieName: string = "authToken") => {
  const [user, loading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);

  const refreshInterval = 50 * 60 * 1000; // 50 minutes
  const [activityTimeout, setActivityTimeout] = useState<NodeJS.Timeout>();
  const lastTokenRefresh = `lastTokenRefresh_${cookieName}`;

  console.log("rendering useAuthToken:", renderCount++);

  const refreshAuthToken = useCallback(async () => {
    try {
      if (!auth.currentUser) throw new Error("No user found");
      const idTokenResult = await getIdToken(auth.currentUser, true);

      setCookie(cookieName, idTokenResult, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      if (!window.ReactNativeWebView) {
        window.localStorage.setItem(lastTokenRefresh, Date.now().toString());
      }
    } catch (error: any) {
      console.log(error?.message || "Error refreshing token");
      deleteCookie(cookieName);
    }
  }, [cookieName, lastTokenRefresh]);

  const scheduleTokenRefresh = useCallback(() => {
    clearTimeout(activityTimeout);
    if (document.visibilityState === "visible") {
      const timeoutId = setTimeout(refreshAuthToken, refreshInterval);
      setActivityTimeout(timeoutId);
    }
  }, [activityTimeout, refreshAuthToken, refreshInterval]);

  const debouncedStorageHandler = debounce((e: StorageEvent) => {
    if (e.key === lastTokenRefresh) {
      scheduleTokenRefresh();
    }
  }, 1000);

  // Handle storage events for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => debouncedStorageHandler(e);

    if (!window.ReactNativeWebView) {
      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
        clearTimeout(activityTimeout);
        debouncedStorageHandler.cancel();
      };
    }
  }, [activityTimeout, debouncedStorageHandler]);

  useEffect(() => {
    if (user?.uid) {
      setAuthDetails({
        uid: user.uid,
        authEmail: user.email || "",
        authDisplayName: user.displayName || "",
        authPhotoUrl: user.photoURL || "",
        authEmailVerified: user.emailVerified || false,
        authReady: true,
        authPending: false,
      });
    } else {
      clearAuthDetails();
      deleteCookie(cookieName);
    }
  }, [
    clearAuthDetails,
    cookieName,
    setAuthDetails,
    user?.uid,
    user?.email,
    user?.displayName,
    user?.photoURL,
    user?.emailVerified,
  ]);

  return { uid: user?.uid, loading, error };
};

export default useAuthToken;
