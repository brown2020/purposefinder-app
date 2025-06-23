import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import useProfileStore from "./useProfileStore";
import { usePurposeStore } from "./usePurposeStore";
import { useMoonshotStore } from "./useMoonshotStore";
import { useIntroStore } from "./useIntroStore";

let renderCount = 0;

export const useInitializeStores = () => {
  const { uid } = useAuthStore();

  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const fetchPurpose = usePurposeStore((state) => state.fetchPurpose);
  const fetchMoonshot = useMoonshotStore((state) => state.fetchMoonshot);
  const fetchIntro = useIntroStore((state) => state.fetchIntro);

  console.log("rendering useInitializeStores:", renderCount++);

  useEffect(() => {
    if (!uid) return;

    fetchProfile();
    fetchPurpose();
    fetchMoonshot();
    fetchIntro();
  }, [uid, fetchProfile, fetchPurpose, fetchMoonshot, fetchIntro]);
};
