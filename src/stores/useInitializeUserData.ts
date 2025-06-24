import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { useUserDataStore } from "./useUserDataStore";

let renderCount = 0;

export const useInitializeUserData = () => {
  const { uid } = useAuthStore();
  const { fetchAllUserData, clearUserData } = useUserDataStore();

  console.log("rendering useInitializeUserData:", renderCount++);

  useEffect(() => {
    if (!uid) {
      // Clear user data when user logs out
      clearUserData();
      return;
    }

    // Fetch all user data when user logs in
    fetchAllUserData();
  }, [uid, fetchAllUserData, clearUserData]);
};
