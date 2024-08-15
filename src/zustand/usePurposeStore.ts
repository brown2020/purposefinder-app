import { create } from "zustand";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { PURPOSE_SURVEY } from "@/constants/purposeSurvey";
import { AnswerType } from "@/types/QuestionAnswerType";

export type PurposeType = {
  id: string;
  answers: AnswerType[];
  mtpGuidance: string;
  mtpOptions: string[];
  mtpSelected: string;
  mtpPrior: string;
  mtpFinal: string;
  visualIdeas: string;
  visualStyle: string;
  visualInspiration: string;
  mtpImage: string;
  mtpCoverImage: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export const defaultPurpose: PurposeType = {
  id: "",
  answers: PURPOSE_SURVEY.map((question) => ({
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

interface PurposeStoreState {
  purposeData: PurposeType;
  purposeLoading: boolean;
  purposeError: Error | null;
  fetchPurpose: () => Promise<void>;
  updatePurpose: (updateData: Partial<PurposeType>) => Promise<void>;
}

export const usePurposeStore = create<PurposeStoreState>((set) => ({
  purposeData: defaultPurpose,
  purposeLoading: false,
  purposeError: null,

  fetchPurpose: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ purposeLoading: true });
    try {
      const docRef = doc(db, `users/${uid}/purpose/main`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as PurposeType;
        set({
          purposeData: {
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
    set({ purposeLoading: true });

    try {
      let currentPurposeData: PurposeType =
        usePurposeStore.getState().purposeData;

      // Start with default answers as the base
      let baseAnswers = defaultPurpose.answers.map((defaultAnswer) => {
        const existingAnswer = currentPurposeData.answers.find(
          (answer) => answer.id === defaultAnswer.id
        );
        return existingAnswer || defaultAnswer;
      });

      // Apply updates from updateData.answers, if present
      if (updateData.answers) {
        updateData.answers.forEach((updateAnswer) => {
          const answerIndex = baseAnswers.findIndex(
            (answer) => answer.id === updateAnswer.id
          );
          if (answerIndex !== -1) {
            baseAnswers[answerIndex] = updateAnswer;
          } else {
            baseAnswers.push(updateAnswer);
          }
        });
      }

      // Prepare the updated moonshot data with merged answers and other updateData fields
      const updatedPurposeData: PurposeType = {
        ...currentPurposeData,
        ...updateData,
        answers: baseAnswers, // Use the merged baseAnswers
        updatedAt: Timestamp.now(),
      };

      // Reference to the Firestore document
      const purposeRef = doc(db, `users/${uid}/purpose/main`);

      // Perform the Firestore update
      await setDoc(purposeRef, updatedPurposeData, { merge: true });

      set({
        purposeData: updatedPurposeData,
        purposeLoading: false,
      });
    } catch (error) {
      set({ purposeError: error as Error, purposeLoading: false });
    }
  },
}));
