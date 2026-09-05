import { create } from 'zustand';

export interface UserProfileData {
  bio?: string;
  avatarUrl?: string;
  streakDays: number;
  completedLessonsCount: number;
  totalQuizzesTaken: number;
  totalEcoActionsLogged: number;
  estimatedCo2SavedKg: number;
}

export interface SkillProfileData {
  domain: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  score: number;
}

interface UserStore {
  profile: UserProfileData | null;
  skillProfiles: SkillProfileData[];
  badges: any[];
  setProfileData: (profile: UserProfileData, skillProfiles: SkillProfileData[], badges: any[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  skillProfiles: [],
  badges: [],
  setProfileData: (profile, skillProfiles, badges) => set({ profile, skillProfiles, badges }),
}));
