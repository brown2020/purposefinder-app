import { create } from "zustand";
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { PURPOSE_JSON } from "@/constants/purposeSurvey";
import { MOONSHOT_JSON } from "@/constants/moonshotSurvey";
import { INTRO_JSON } from "@/constants/introSurvey";
import { 
  QuestionType, 
  ProfileType, 
  PurposeType, 
  MoonshotType, 
  IntroType 
} from "@/types";

// Default values
const defaultProfile: ProfileType = {
  email: "",
  contactEmail: "",
  displayName: "",
  photoUrl: "",
  emailVerified: false,
  answers: [],
};

export const defaultPurpose: PurposeType = {
  id: "",
  answers: PURPOSE_JSON.map((question) => ({
    id: question.id || "",
    type: question.type || "",
    question: question.question || "",
    options: question.options || [],
    answer: [],
  })),
  mtpGuidance: "",
  mtpOptions: [],
  mtpSelected: "",
  mtpPrior: "",
  mtpFinal: "",
  visualIdeas: "",
  visualStyle: "",
  visualInspiration: "",
  mtpImage: "",
  mtpCoverImage: "",
};

export const defaultMoonshot: MoonshotType = {
  id: "",
  answers: MOONSHOT_JSON?.map((question) => ({
    id: question.id || "",
    type: question.type || "",
    question: question.question || "",
    options: question.options || [],
    answer: [],
  })),
  moonshotGuidance: "",
  moonshotOptions: [],
  moonshotSelected: "",
  moonshotPrior: "",
  moonshotFinal: "",
  visualIdeas: "",
  visualStyle: "",
  visualInspiration: "",
  moonshotImage: "",
  moonshotCoverImage: "",
};

export const defaultIntro: IntroType = {
  id: "",
  answers: INTRO_JSON.map((question) => ({
    id: question.id || "",
    type: question.type || "",
    question: question.question || "",
    options: question.options || [],
    answer: [],
  })),
};

// Store state interface
interface UserDataState {
  // Data
  profile: ProfileType;
  purpose: PurposeType;
  moonshot: MoonshotType;
  intro: IntroType;
  
  // Loading states
  isLoading: boolean;
  profileLoading: boolean;
  purposeLoading: boolean;
  moonshotLoading: boolean;
  introLoading: boolean;
  
  // Error states
  error: Error | null;
  profileError: Error | null;
  purposeError: Error | null;
  moonshotError: Error | null;
  introError: Error | null;
  
  // Actions
  fetchAllUserData: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchPurpose: () => Promise<void>;
  fetchMoonshot: () => Promise<void>;
  fetchIntro: () => Promise<void>;
  updateProfile: (data: Partial<ProfileType>) => Promise<void>;
  updatePurpose: (data: Partial<PurposeType>) => Promise<void>;
  updateMoonshot: (data: Partial<MoonshotType>) => Promise<void>;
  updateIntro: (data: Partial<IntroType>) => Promise<void>;
  clearUserData: () => void;
}

// Helper function to create default profile from auth data
const createDefaultProfile = (): ProfileType => {
  const authState = useAuthStore.getState();
  const authFirstName = authState.selectedName || authState.authDisplayName?.split(" ")[0] || "";
  const authLastName = authState.authDisplayName?.split(" ")[1] || "";
  
  return {
    email: authState.authEmail || "",
    contactEmail: authState.authEmail || "",
    displayName: authState.authDisplayName || "",
    photoUrl: authState.authPhotoUrl || "",
    emailVerified: authState.authEmailVerified || false,
    firstName: authFirstName,
    lastName: authLastName,
    headerUrl: "",
    organization: "",
    title: "",
    bio: "",
    interests: "",
    location: "",
    website: "",
    linkedin: "",
    purposeId: "",
    moonshotId: "",
    answers: [],
  };
};

// Helper function to merge answers
const mergeAnswers = (defaultAnswers: QuestionType[], updateAnswers?: QuestionType[]): QuestionType[] => {
  if (!updateAnswers) return defaultAnswers;
  
  const baseAnswers = [...defaultAnswers];
  updateAnswers.forEach((updateAnswer) => {
    const answerIndex = baseAnswers.findIndex((answer) => answer.id === updateAnswer.id);
    if (answerIndex !== -1) {
      baseAnswers[answerIndex] = updateAnswer;
    } else {
      baseAnswers.push(updateAnswer);
    }
  });
  
  return baseAnswers;
};

// Create the store
export const useUserDataStore = create<UserDataState>((set, get) => ({
  // Initial state
  profile: defaultProfile,
  purpose: defaultPurpose,
  moonshot: defaultMoonshot,
  intro: defaultIntro,
  
  isLoading: false,
  profileLoading: false,
  purposeLoading: false,
  moonshotLoading: false,
  introLoading: false,
  
  error: null,
  profileError: null,
  purposeError: null,
  moonshotError: null,
  introError: null,

  // Fetch all user data in parallel
  fetchAllUserData: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ isLoading: true, error: null });
    
    try {
      await Promise.all([
        get().fetchProfile(),
        get().fetchPurpose(),
        get().fetchMoonshot(),
        get().fetchIntro(),
      ]);
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  // Profile actions
  fetchProfile: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ profileLoading: true, profileError: null });
    
    try {
      const userRef = doc(db, `users/${uid}/settings/profile`);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().profile) {
        const data = docSnap.data().profile;
        const authState = useAuthStore.getState();
        
        set({
          profile: {
            email: authState.authEmail || "",
            contactEmail: data.contactEmail || authState.authEmail || "",
            displayName: data.displayName || authState.authDisplayName || "",
            photoUrl: data.photoUrl || authState.authPhotoUrl || "",
            emailVerified: authState.authEmailVerified || false,
            firstName: data.firstName || authState.selectedName || authState.authDisplayName?.split(" ")[0] || "",
            lastName: data.lastName || authState.authDisplayName?.split(" ")[1] || "",
            headerUrl: data.headerUrl || "",
            organization: data.organization || "",
            title: data.title || "",
            bio: data.bio || "",
            interests: data.interests || "",
            location: data.location || "",
            website: data.website || "",
            linkedin: data.linkedin || "",
            purposeId: data.purposeId || "",
            moonshotId: data.moonshotId || "",
            answers: data.answers || [],
          },
          profileLoading: false,
        });
      } else {
        const newProfile = createDefaultProfile();
        await setDoc(userRef, { profile: newProfile });
        set({ profile: newProfile, profileLoading: false });
        console.log("Profile created successfully");
      }
    } catch (error) {
      set({ profileError: error as Error, profileLoading: false });
      console.error("Error fetching or creating profile:", error);
    }
  },

  updateProfile: async (newProfile: Partial<ProfileType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    try {
      const userRef = doc(db, `users/${uid}/settings/profile`);
      const currentProfile = get().profile;
      const authState = useAuthStore.getState();
      
      const authFirstName = newProfile.firstName || 
        authState.selectedName || 
        currentProfile.firstName || 
        authState.authDisplayName?.split(" ")[0] || "";

      const profileFixed = { ...newProfile, firstName: authFirstName };
      const updatedProfile = { ...currentProfile, ...profileFixed };

      set({ profile: updatedProfile });
      await setDoc(userRef, { profile: profileFixed }, { merge: true });
      console.log("Profile updated successfully");
    } catch (error) {
      set({ profileError: error as Error });
      console.error("Error updating profile:", error);
    }
  },

  // Purpose actions
  fetchPurpose: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ purposeLoading: true, purposeError: null });
    
    try {
      const docRef = doc(db, `users/${uid}/purpose/main`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as PurposeType;
        set({
          purpose: {
            ...defaultPurpose,
            ...data,
            id: docRef.id,
          },
          purposeLoading: false,
        });
      } else {
        throw new Error("Purpose not found");
      }
    } catch (error) {
      set({ purposeError: error as Error, purposeLoading: false });
    }
  },

  updatePurpose: async (updateData: Partial<PurposeType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ purposeLoading: true, purposeError: null });

    try {
      const currentPurpose = get().purpose;
      const mergedAnswers = mergeAnswers(defaultPurpose.answers, updateData.answers);

      const updatedPurpose: PurposeType = {
        ...currentPurpose,
        ...updateData,
        answers: mergedAnswers,
        updatedAt: Timestamp.now(),
      };

      const purposeRef = doc(db, `users/${uid}/purpose/main`);
      await setDoc(purposeRef, updatedPurpose, { merge: true });

      set({
        purpose: updatedPurpose,
        purposeLoading: false,
      });
    } catch (error) {
      set({ purposeError: error as Error, purposeLoading: false });
    }
  },

  // Moonshot actions
  fetchMoonshot: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ moonshotLoading: true, moonshotError: null });
    
    try {
      const docRef = doc(db, `users/${uid}/moonshot/main`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as MoonshotType;
        set({
          moonshot: {
            ...defaultMoonshot,
            ...data,
            id: docRef.id,
          },
          moonshotLoading: false,
        });
      } else {
        throw new Error("Moonshot not found");
      }
    } catch (error) {
      set({ moonshotError: error as Error, moonshotLoading: false });
    }
  },

  updateMoonshot: async (updateData: Partial<MoonshotType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ moonshotLoading: true, moonshotError: null });

    try {
      const currentMoonshot = get().moonshot;
      const mergedAnswers = mergeAnswers(defaultMoonshot.answers, updateData.answers);

      const updatedMoonshot: MoonshotType = {
        ...currentMoonshot,
        ...updateData,
        answers: mergedAnswers,
        updatedAt: Timestamp.now(),
      };

      const moonshotRef = doc(db, `users/${uid}/moonshot/main`);
      await setDoc(moonshotRef, updatedMoonshot, { merge: true });

      set({
        moonshot: updatedMoonshot,
        moonshotLoading: false,
      });
    } catch (error) {
      set({ moonshotError: error as Error, moonshotLoading: false });
    }
  },

  // Intro actions
  fetchIntro: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ introLoading: true, introError: null });
    
    try {
      const docRef = doc(db, `users/${uid}/intro/main`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as IntroType;
        set({
          intro: {
            ...defaultIntro,
            ...data,
            id: docRef.id,
          },
          introLoading: false,
        });
      } else {
        throw new Error("Intro not found");
      }
    } catch (error) {
      set({ introError: error as Error, introLoading: false });
    }
  },

  updateIntro: async (updateData: Partial<IntroType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ introLoading: true, introError: null });

    try {
      const currentIntro = get().intro;
      
      // Merge answers
      const updatedAnswers = currentIntro.answers.map((answer) => {
        const updatedAnswer = updateData.answers?.find((a) => a.id === answer.id);
        return updatedAnswer ? { ...answer, ...updatedAnswer } : answer;
      });

      // Add any new answers
      updateData.answers?.forEach((newAnswer) => {
        if (!updatedAnswers.find((answer) => answer.id === newAnswer.id)) {
          updatedAnswers.push(newAnswer);
        }
      });

      const updatedIntro: IntroType = {
        ...currentIntro,
        ...updateData,
        answers: updatedAnswers,
        updatedAt: Timestamp.now(),
      };

      const introRef = doc(db, `users/${uid}/intro/main`);
      await setDoc(introRef, updatedIntro, { merge: true });

      set({
        intro: updatedIntro,
        introLoading: false,
      });
    } catch (error) {
      set({ introError: error as Error, introLoading: false });
    }
  },

  // Clear all user data
  clearUserData: () => {
    set({
      profile: defaultProfile,
      purpose: defaultPurpose,
      moonshot: defaultMoonshot,
      intro: defaultIntro,
      isLoading: false,
      profileLoading: false,
      purposeLoading: false,
      moonshotLoading: false,
      introLoading: false,
      error: null,
      profileError: null,
      purposeError: null,
      moonshotError: null,
      introError: null,
    });
  },
}));

// Convenience hooks for backward compatibility
export const useProfile = () => {
  const profile = useUserDataStore((state) => state.profile);
  const loading = useUserDataStore((state) => state.profileLoading);
  const error = useUserDataStore((state) => state.profileError);
  const fetchProfile = useUserDataStore((state) => state.fetchProfile);
  const updateProfile = useUserDataStore((state) => state.updateProfile);
  
  return { profile, loading, error, fetchProfile, updateProfile };
};

export const usePurpose = () => {
  const purposeData = useUserDataStore((state) => state.purpose);
  const purposeLoading = useUserDataStore((state) => state.purposeLoading);
  const purposeError = useUserDataStore((state) => state.purposeError);
  const fetchPurpose = useUserDataStore((state) => state.fetchPurpose);
  const updatePurpose = useUserDataStore((state) => state.updatePurpose);
  
  return { purposeData, purposeLoading, purposeError, fetchPurpose, updatePurpose };
};

export const useMoonshot = () => {
  const moonshotData = useUserDataStore((state) => state.moonshot);
  const moonshotLoading = useUserDataStore((state) => state.moonshotLoading);
  const moonshotError = useUserDataStore((state) => state.moonshotError);
  const fetchMoonshot = useUserDataStore((state) => state.fetchMoonshot);
  const updateMoonshot = useUserDataStore((state) => state.updateMoonshot);
  
  return { moonshotData, moonshotLoading, moonshotError, fetchMoonshot, updateMoonshot };
};

export const useIntro = () => {
  const introData = useUserDataStore((state) => state.intro);
  const introLoading = useUserDataStore((state) => state.introLoading);
  const introError = useUserDataStore((state) => state.introError);
  const fetchIntro = useUserDataStore((state) => state.fetchIntro);
  const updateIntro = useUserDataStore((state) => state.updateIntro);
  
  return { introData, introLoading, introError, fetchIntro, updateIntro };
};
