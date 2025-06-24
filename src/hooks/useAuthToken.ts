import { useEffect, useState, useCallback } from "react";
import { getIdToken } from "firebase/auth";
import { debounce } from "lodash";
import { deleteCookie, setCookie, getCookie } from "cookies-next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import { auth } from "@/lib/firebase/firebaseConfig";

const useAuthToken = (cookieName = "authToken") => {
  const [user, loading, error] = useAuthState(auth);
  const setAuthDetails = useAuthStore((state) => state.setAuthDetails);
  const clearAuthDetails = useAuthStore((state) => state.clearAuthDetails);

  const refreshInterval = 50 * 60 * 1000; // 50 minutes
  const lastTokenRefresh = `lastTokenRefresh_${cookieName}`;

  const [activityTimeout, setActivityTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const refreshAuthToken = useCallback(async () => {
    try {
      if (!auth.currentUser) throw new Error("No user found");
      const idTokenResult = await getIdToken(auth.currentUser, true);

      setCookie(cookieName, idTokenResult, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });
      if (!window.ReactNativeWebView) {
        window.localStorage.setItem(lastTokenRefresh, Date.now().toString());
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Error refreshing token");
      }
      deleteCookie(cookieName);
    }
  }, [cookieName, lastTokenRefresh]);

  const checkAndMigrateCookie = useCallback(async () => {
    if (!user?.uid) return;
    
    // Check if cookie exists and has proper format for middleware
    const existingCookie = getCookie(cookieName);
    
    if (!existingCookie) {
      // No cookie exists, refresh to create one with proper format
      console.log("No auth cookie found, creating new one for middleware compatibility");
      await refreshAuthToken();
    } else {
      // Cookie exists, but let's refresh it once to ensure it has the new format
      // We'll use localStorage to track if we've done this migration
      const migrationKey = `cookieMigrated_${cookieName}`;
      const hasMigrated = localStorage.getItem(migrationKey);
      
      if (!hasMigrated) {
        console.log("Migrating auth cookie to new format for middleware compatibility");
        await refreshAuthToken();
        localStorage.setItem(migrationKey, "true");
      }
    }
  }, [user?.uid, cookieName, refreshAuthToken]);

  const scheduleTokenRefresh = useCallback(() => {
    if (activityTimeout) {
      clearTimeout(activityTimeout);
    }
    if (document.visibilityState === "visible") {
      const timeoutId = setTimeout(refreshAuthToken, refreshInterval);
      setActivityTimeout(timeoutId);
    }
  }, [activityTimeout, refreshAuthToken, refreshInterval]);

  const handleStorageChange = useCallback((e: StorageEvent) => {
    const debouncedHandler = debounce(() => {
      if (e.key === lastTokenRefresh) {
        scheduleTokenRefresh();
      }
    }, 1000);
    debouncedHandler();
  }, [lastTokenRefresh, scheduleTokenRefresh]);

  useEffect(() => {
    if (!window.ReactNativeWebView) {
      window.addEventListener("storage", handleStorageChange);
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
    };
  }, [activityTimeout, handleStorageChange]);

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
      
      // Automatically migrate cookie format for middleware compatibility
      checkAndMigrateCookie();
    } else {
      clearAuthDetails();
      deleteCookie(cookieName);
    }
  }, [clearAuthDetails, cookieName, setAuthDetails, user, checkAndMigrateCookie]);

  return { uid: user?.uid, loading, error };
};

export default useAuthToken;
