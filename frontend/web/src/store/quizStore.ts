import { create } from 'zustand';

export interface QuizQuestion {
  question: string;
  topic: string;
  level: string;
  options: string[];
}

export interface QuizSession {
  _id: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

interface QuizStore {
  currentQuiz: QuizSession | null;
  currentQuestionIndex: number;
  userAnswers: string[];
  responseTimes: number[];
  startTime: number | null;
  setQuiz: (quiz: QuizSession) => void;
  answerQuestion: (answer: string, responseTime: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  responseTimes: [],
  startTime: null,
  setQuiz: (quiz) =>
    set({
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      userAnswers: [],
      responseTimes: [],
      startTime: Date.now(),
    }),
  answerQuestion: (answer, responseTime) => {
    const { currentQuestionIndex, userAnswers, responseTimes } = get();
    set({
      userAnswers: [...userAnswers, answer],
      responseTimes: [...responseTimes, responseTime],
      currentQuestionIndex: currentQuestionIndex + 1,
    });
  },
  resetQuiz: () =>
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      userAnswers: [],
      responseTimes: [],
      startTime: null,
    }),
}));
