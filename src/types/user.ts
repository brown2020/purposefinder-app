import { Timestamp } from "firebase/firestore";
import type { QuestionType, AnswerType } from './survey';

export type ProfileType = {
  email: string;
  contactEmail: string;
  displayName: string;
  photoUrl: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  headerUrl?: string;
  organization?: string;
  title?: string;
  bio?: string;
  interests?: string;
  location?: string;
  country?: string;
  identifyWith?: string[];
  website?: string;
  linkedin?: string;
  purposeId?: string;
  moonshotId?: string;
  answers: AnswerType[];
};

export type PurposeType = {
  id: string;
  answers: QuestionType[];
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

export type IntroType = {
  id: string;
  answers: QuestionType[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
