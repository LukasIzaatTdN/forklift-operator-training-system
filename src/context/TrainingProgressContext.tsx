import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { Certificate, QuizAttempt, TrainingTrack, UserTrainingProgress } from '../types';
import { CERTIFICATE_VALIDITY_MONTHS, addMonths, isCertificateExpired } from '../utils/certificates';
import { firestoreDb } from '../lib/firebase';

const STORAGE_KEY = 'tropa_do_garfo_training_progress_v1';

interface TrackStatus {
  modulesCompleted: number;
  modulesTotal: number;
  modulesDone: boolean;
  quizDone: boolean;
  checklistDone: boolean;
  progressPercentage: number;
  bestQuizScore: number;
  certified: boolean;
}

interface TrainingProgressContextType {
  progress: UserTrainingProgress | null;
  markModuleCompleted: (moduleId: string) => void;
  markLessonCompleted: (moduleId: string, lessonId: string, moduleLessonIds: string[]) => void;
  markChecklistCompleted: () => void;
  recordQuizAttempt: (score: number, totalQuestions: number) => void;
  issueCertificate: (track: TrainingTrack) => Promise<Certificate | null>;
  getTrackStatus: (track: TrainingTrack, userId?: string) => TrackStatus;
  getProgressForUser: (userId: string) => UserTrainingProgress;
}

const TrainingProgressContext = createContext<TrainingProgressContextType | null>(null);

function createDefaultProgress(userId: string): UserTrainingProgress {
  return {
    userId,
    completedModuleIds: [],
    completedLessonIds: [],
    checklistCompletions: 0,
    lastChecklistAt: null,
    quizAttempts: [],
    certificates: [],
    updatedAt: Date.now(),
  };
}

function normalizeProgress(progress: Partial<UserTrainingProgress>, userId: string): UserTrainingProgress {
  const base = createDefaultProgress(userId);
  const merged: UserTrainingProgress = {
    ...base,
    ...progress,
    userId,
    completedModuleIds: progress.completedModuleIds || [],
    completedLessonIds: progress.completedLessonIds || [],
    checklistCompletions: progress.checklistCompletions || 0,
    lastChecklistAt: progress.lastChecklistAt || null,
    quizAttempts: progress.quizAttempts || [],
    certificates: (progress.certificates || []).map((cert) => ({
      ...cert,
      validUntil: cert.validUntil || addMonths(cert.issuedAt, CERTIFICATE_VALIDITY_MONTHS),
    })),
    updatedAt: progress.updatedAt || Date.now(),
  };

  return merged;
}

function sameDay(a: string | null, b: Date): boolean {
  if (!a) return false;
  return new Date(a).toDateString() === b.toDateString();
}

function buildTrackStatus(progress: UserTrainingProgress, track: TrainingTrack): TrackStatus {
  const modulesCompleted = track.moduleIds.filter((id) =>
    progress.completedModuleIds.includes(id)
  ).length;
  const modulesTotal = track.moduleIds.length;
  const bestQuizScore = progress.quizAttempts.reduce(
    (best, attempt) => (attempt.percentage > best ? attempt.percentage : best),
    0
  );

  const modulesDone = modulesCompleted >= modulesTotal;
  const quizDone = bestQuizScore >= track.quizMinScore;
  const checklistDone = !track.checklistRequired || progress.checklistCompletions > 0;
  const completedChecks = [modulesDone, quizDone, checklistDone].filter(Boolean).length;

  return {
    modulesCompleted,
    modulesTotal,
    modulesDone,
    quizDone,
    checklistDone,
    progressPercentage: Math.round((completedChecks / 3) * 100),
    bestQuizScore,
    certified: progress.certificates.some((cert) => cert.trackId === track.id && !isCertificateExpired(cert)),
  };
}

export function TrainingProgressProvider({ children }: { children: ReactNode }) {
  const { user, authMode } = useAuth();
  const [allProgress, setAllProgress] = useState<Record<string, UserTrainingProgress>>({});

  const loadLocalProgress = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Record<string, UserTrainingProgress>;
      const migrated: Record<string, UserTrainingProgress> = {};

      for (const [userId, progress] of Object.entries(parsed)) {
        migrated[userId] = normalizeProgress(progress, userId);
      }

      setAllProgress(migrated);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loadRemoteProgress = useCallback(async () => {
    if (!user || authMode !== 'firebase' || !firestoreDb) return;

    const ref = doc(firestoreDb, 'user_progress', user.id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const defaultProgress = createDefaultProgress(user.id);
      setAllProgress((prev) => ({ ...prev, [user.id]: defaultProgress }));
      await setDoc(ref, defaultProgress, { merge: true });
      return;
    }

    const merged = normalizeProgress(snap.data() as Partial<UserTrainingProgress>, user.id);
    setAllProgress((prev) => ({ ...prev, [user.id]: merged }));
  }, [authMode, user]);

  useEffect(() => {
    if (authMode === 'firebase' && user) {
      void loadRemoteProgress();
      return;
    }

    loadLocalProgress();
  }, [authMode, loadLocalProgress, loadRemoteProgress, user]);

  useEffect(() => {
    if (authMode === 'firebase') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  }, [allProgress, authMode]);

  const persistProgress = useCallback(
    async (nextProgress: UserTrainingProgress) => {
      if (authMode === 'firebase' && firestoreDb) {
        await setDoc(doc(firestoreDb, 'user_progress', nextProgress.userId), nextProgress, { merge: true });
      }
    },
    [authMode]
  );

  const getProgressForUser = useCallback(
    (userId: string): UserTrainingProgress => {
      return allProgress[userId] || createDefaultProgress(userId);
    },
    [allProgress]
  );

  const updateCurrentUserProgress = useCallback(
    (updater: (current: UserTrainingProgress) => UserTrainingProgress) => {
      if (!user) return;

      let updatedProgress: UserTrainingProgress | null = null;

      setAllProgress((prev) => {
        const current = prev[user.id] || createDefaultProgress(user.id);
        updatedProgress = {
          ...updater(current),
          updatedAt: Date.now(),
        };

        return {
          ...prev,
          [user.id]: updatedProgress,
        };
      });

      if (updatedProgress) {
        void persistProgress(updatedProgress);
      }
    },
    [persistProgress, user]
  );

  const markModuleCompleted = useCallback(
    (moduleId: string) => {
      updateCurrentUserProgress((current) => {
        if (current.completedModuleIds.includes(moduleId)) {
          return current;
        }

        return {
          ...current,
          completedModuleIds: [...current.completedModuleIds, moduleId],
        };
      });
    },
    [updateCurrentUserProgress]
  );

  const markLessonCompleted = useCallback(
    (moduleId: string, lessonId: string, moduleLessonIds: string[]) => {
      updateCurrentUserProgress((current) => {
        const lessonSet = new Set(current.completedLessonIds);
        lessonSet.add(lessonId);

        const moduleCompletedByLessons = moduleLessonIds.every((id) => lessonSet.has(id));
        const moduleIds = current.completedModuleIds.includes(moduleId)
          ? current.completedModuleIds
          : moduleCompletedByLessons
            ? [...current.completedModuleIds, moduleId]
            : current.completedModuleIds;

        return {
          ...current,
          completedLessonIds: Array.from(lessonSet),
          completedModuleIds: moduleIds,
        };
      });
    },
    [updateCurrentUserProgress]
  );

  const markChecklistCompleted = useCallback(() => {
    updateCurrentUserProgress((current) => {
      const now = new Date();

      if (sameDay(current.lastChecklistAt, now)) {
        return current;
      }

      return {
        ...current,
        checklistCompletions: current.checklistCompletions + 1,
        lastChecklistAt: now.toISOString(),
      };
    });
  }, [updateCurrentUserProgress]);

  const recordQuizAttempt = useCallback(
    (score: number, totalQuestions: number) => {
      updateCurrentUserProgress((current) => {
        const percentage = Math.round((score / totalQuestions) * 100);

        const attempt: QuizAttempt = {
          id: `attempt-${Date.now()}`,
          completedAt: Date.now(),
          score,
          totalQuestions,
          percentage,
          passed: percentage >= 70,
        };

        return {
          ...current,
          quizAttempts: [attempt, ...current.quizAttempts].slice(0, 20),
        };
      });
    },
    [updateCurrentUserProgress]
  );

  const getTrackStatus = useCallback(
    (track: TrainingTrack, userId?: string): TrackStatus => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) {
        return {
          modulesCompleted: 0,
          modulesTotal: track.moduleIds.length,
          modulesDone: false,
          quizDone: false,
          checklistDone: false,
          progressPercentage: 0,
          bestQuizScore: 0,
          certified: false,
        };
      }

      return buildTrackStatus(getProgressForUser(targetUserId), track);
    },
    [getProgressForUser, user]
  );

  const issueCertificate = useCallback(
    async (track: TrainingTrack): Promise<Certificate | null> => {
      if (!user) return null;

      const currentProgress = getProgressForUser(user.id);
      const status = buildTrackStatus(currentProgress, track);
      if (!status.modulesDone || !status.quizDone || !status.checklistDone || status.certified) {
        return null;
      }

      const issuedAt = Date.now();
      const certificate: Certificate = {
        id: `cert-${track.id}-${Date.now()}`,
        trackId: track.id,
        trackTitle: track.title,
        issuedAt,
        validUntil: addMonths(issuedAt, CERTIFICATE_VALIDITY_MONTHS),
        finalScore: status.bestQuizScore,
      };

      const nextProgress: UserTrainingProgress = {
        ...currentProgress,
        certificates: [certificate, ...currentProgress.certificates],
        updatedAt: Date.now(),
      };

      if (authMode === 'firebase' && firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'user_progress', nextProgress.userId), nextProgress, { merge: true });
        } catch {
          return null;
        }
      }

      setAllProgress((prev) => ({
        ...prev,
        [user.id]: nextProgress,
      }));

      return certificate;
    },
    [authMode, getProgressForUser, user]
  );

  const progress = useMemo(() => {
    if (!user) return null;
    return getProgressForUser(user.id);
  }, [getProgressForUser, user]);

  return (
    <TrainingProgressContext.Provider
      value={{
        progress,
        markModuleCompleted,
        markLessonCompleted,
        markChecklistCompleted,
        recordQuizAttempt,
        issueCertificate,
        getTrackStatus,
        getProgressForUser,
      }}
    >
      {children}
    </TrainingProgressContext.Provider>
  );
}

export function useTrainingProgress(): TrainingProgressContextType {
  const context = useContext(TrainingProgressContext);
  if (!context) {
    throw new Error('useTrainingProgress must be used within a TrainingProgressProvider');
  }
  return context;
}
