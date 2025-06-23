import { create } from "zustand";
import { db } from "@/lib/firebase/firebaseConfig";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { useAuthStore } from "./useAuthStore";
import { MOONSHOT_JSON } from "@/constants/moonshotSurvey";
import { QuestionType } from "@/types/QuestionAnswerType";

export type MoonshotType = {
  id: string;
  answers: QuestionType[];
  moonshotGuidance: string;
  moonshotOptions: string[];
  moonshotSelected: string;
  moonshotPrior: string;
  moonshotFinal: string;
  visualIdeas: string;
  visualStyle: string;
  visualInspiration: string;
  moonshotImage: string;
  moonshotCoverImage: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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

interface MoonshotStoreState {
  moonshotData: MoonshotType;
  moonshotLoading: boolean;
  moonshotError: Error | null;
  fetchMoonshot: () => Promise<void>;
  updateMoonshot: (updateData: Partial<MoonshotType>) => Promise<void>;
}

export const useMoonshotStore = create<MoonshotStoreState>((set) => ({
  moonshotData: defaultMoonshot,
  moonshotLoading: false,
  moonshotError: null,

  fetchMoonshot: async () => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;
    set({ moonshotLoading: true });
    try {
      const docRef = doc(db, `users/${uid}/moonshot/main`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as MoonshotType;
        set({
          moonshotData: {
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
    set({ moonshotLoading: true });

    try {
      const currentMoonshotData: MoonshotType =
        useMoonshotStore.getState().moonshotData;

      // Start with default answers as the base
      const baseAnswers = defaultMoonshot.answers.map((defaultAnswer) => {
        const existingAnswer = currentMoonshotData.answers.find(
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
      const updatedMoonshotData: MoonshotType = {
        ...currentMoonshotData,
        ...updateData,
        answers: baseAnswers, // Use the merged baseAnswers
        updatedAt: Timestamp.now(),
      };

      // Reference to the Firestore document
      const moonshotRef = doc(db, `users/${uid}/moonshot/main`);

      // Perform the Firestore update
      await setDoc(moonshotRef, updatedMoonshotData, { merge: true });


      // Update local state with the new moonshot data
      set({
        moonshotData: updatedMoonshotData,
        moonshotLoading: false,
      });
    } catch (error) {
      set({ moonshotError: error as Error, moonshotLoading: false });
    }
  },
}));
