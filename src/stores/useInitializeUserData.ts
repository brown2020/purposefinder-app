import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "./useAuthStore";
import { useUserDataStore } from "./useUserDataStore";

let renderCount = 0;

export const useInitializeUserData = () => {
  const uid = useAuthStore((state) => state.uid);
  const prevUidRef = useRef<string>("");

  console.log("rendering useInitializeUserData:", renderCount++);

  // Memoized functions to prevent recreation on every render
  const handleDataInitialization = useCallback(() => {
    const currentUid = uid || "";

    // Only proceed if uid actually changed
    if (prevUidRef.current === currentUid) {
      return;
    }

    prevUidRef.current = currentUid;

    if (!currentUid) {
      // Clear user data when user logs out
      useUserDataStore.getState().clearUserData();
      return;
    }

    // Fetch all user data when user logs in
    useUserDataStore.getState().fetchAllUserData();
  }, [uid]);

  useEffect(() => {
    handleDataInitialization();
  }, [handleDataInitialization]);
};
