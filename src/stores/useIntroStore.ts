import { create } from "zustand";
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { INTRO_JSON } from "@/constants/introSurvey";
import { QuestionType } from "@/types/QuestionAnswerType";

export type IntroType = {
  id: string;
  answers: QuestionType[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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
      const currentIntroData: IntroType = useIntroStore.getState().introData;

      // Merge the new answers with the existing ones
      const updatedAnswers = currentIntroData.answers.map((answer) => {
        const updatedAnswer = updateData.answers?.find((a) => a.id === answer.id);
        return updatedAnswer ? { ...answer, ...updatedAnswer } : answer;
      });

      // Add any new answers that were not in the existing answers
      updateData.answers?.forEach((newAnswer) => {
        if (!updatedAnswers.find((answer) => answer.id === newAnswer.id)) {
          updatedAnswers.push(newAnswer);
        }
      });

      const updatedIntroData: IntroType = {
        ...currentIntroData,
        ...updateData,
        answers: updatedAnswers,
        updatedAt: Timestamp.now(),
      };

      const introRef = doc(db, `users/${uid}/intro/main`);
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