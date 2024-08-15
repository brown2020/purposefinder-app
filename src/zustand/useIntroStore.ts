import { create } from "zustand";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";

import { AnswerType } from "@/types/QuestionAnswerType";
import { INTRO_SURVEY } from "@/constants/introSurvey";

export type IntroType = {
  id: string;
  answers: AnswerType[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export const defaultIntro: IntroType = {
  id: "",
  answers: INTRO_SURVEY.map((question) => ({
    id: question.id || "",
    type: question.type || "",
    question: question.question || "",
    options: question.options || [],
    answer: [],
  })),
};

interface IntroStoreState {
  introData: IntroType;
  introLoading: boolean;
  introError: Error | null;
  fetchIntro: () => Promise<void>;
  updateIntro: (updateData: Partial<IntroType>) => Promise<void>;
}

export const useIntroStore = create<IntroStoreState>((set) => ({
  introData: defaultIntro,
  introLoading: false,
  introError: null,

  fetchIntro: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    set({ introLoading: true });
    try {
      const docRef = doc(db, `users/${uid}/intro/main`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as IntroType;
        set({
          introData: {
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
    set({ introLoading: true });

    try {
      let currentIntroData: IntroType = useIntroStore.getState().introData;

      // Start with default answers as the base
      let baseAnswers = defaultIntro.answers.map((defaultAnswer) => {
        const existingAnswer = currentIntroData.answers.find(
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
      const updatedIntroData: IntroType = {
        ...currentIntroData,
        ...updateData,
        answers: baseAnswers, // Use the merged baseAnswers
        updatedAt: Timestamp.now(),
      };

      // Reference to the Firestore document
      const introRef = doc(db, `users/${uid}/intro/main`);

      // Perform the Firestore update
      await setDoc(introRef, updatedIntroData, { merge: true });

      set({
        introData: updatedIntroData,
        introLoading: false,
      });
    } catch (error) {
      set({ introError: error as Error, introLoading: false });
    }
  },
}));
