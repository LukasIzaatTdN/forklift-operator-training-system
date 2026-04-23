export interface TrainingModule {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string[];
  highlights?: string[];
  warnings?: string[];
}

export interface LessonMicroQuiz {
  moduleId: string;
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DailyTip {
  id: number;
  title: string;
  content: string;
  category: 'seguranca' | 'operacao' | 'manutencao' | 'ergonomia';
  emoji: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  critical: boolean;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  duration: string;
  thumbnail?: string;
  addedAt: number;
}

export type UserRole = 'admin' | 'operator' | 'operador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithToken: (
    name: string,
    email: string,
    password: string,
    creationToken: string
  ) => Promise<{ success: boolean; error?: string }>;
  generateCreationToken: (validHours?: number) => Promise<{ success: boolean; token?: string; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authMode: 'firebase' | 'local';
}

export interface TrainingTrack {
  id: string;
  title: string;
  description: string;
  targetRoles: UserRole[];
  moduleIds: string[];
  quizMinScore: number;
  checklistRequired: boolean;
}

export interface QuizAttempt {
  id: string;
  completedAt: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
}

export interface Certificate {
  id: string;
  trackId: string;
  trackTitle: string;
  issuedAt: number;
  validUntil: number;
  finalScore: number;
}

export interface UserTrainingProgress {
  userId: string;
  completedModuleIds: string[];
  completedLessonIds: string[];
  checklistCompletions: number;
  lastChecklistAt: string | null;
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  updatedAt: number;
}
