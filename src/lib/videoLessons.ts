import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { defaultVideos } from '../data/videos';
import { VideoLesson } from '../types';
import { firestoreDb } from './firebase';

const STORAGE_KEY = 'empilhapro_videos';
const COLLECTION = 'video_lessons';

function sortByAddedAtDesc(items: VideoLesson[]): VideoLesson[] {
  return [...items].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
}

// Mescla defaults com overrides/custom vindos do banco.
export function mergeDefaultWithStored(storedVideos: VideoLesson[]): VideoLesson[] {
  const map = new Map<string, VideoLesson>();

  for (const video of defaultVideos) {
    map.set(video.id, video);
  }

  for (const video of storedVideos) {
    map.set(video.id, video);
  }

  return sortByAddedAtDesc(Array.from(map.values()));
}

export function loadVideosFromLocalStorage(): VideoLesson[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return sortByAddedAtDesc(defaultVideos);

  try {
    const parsed = JSON.parse(stored) as VideoLesson[];
    return sortByAddedAtDesc(parsed);
  } catch {
    return sortByAddedAtDesc(defaultVideos);
  }
}

export function saveVideosToLocalStorage(videos: VideoLesson[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortByAddedAtDesc(videos)));
}

export function subscribeVideoLessons(
  onChange: (videos: VideoLesson[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!firestoreDb) {
    onChange(loadVideosFromLocalStorage());
    return () => {};
  }

  const q = query(collection(firestoreDb, COLLECTION), orderBy('addedAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const storedVideos = snapshot.docs.map((item) => item.data() as VideoLesson);
      onChange(mergeDefaultWithStored(storedVideos));
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

export async function upsertVideoLesson(video: VideoLesson): Promise<void> {
  if (!firestoreDb) {
    const current = loadVideosFromLocalStorage();
    const updated = current.some((item) => item.id === video.id)
      ? current.map((item) => (item.id === video.id ? video : item))
      : [...current, video];
    saveVideosToLocalStorage(updated);
    return;
  }

  await setDoc(doc(firestoreDb, COLLECTION, video.id), video, { merge: true });
}

export async function removeVideoLesson(videoId: string): Promise<void> {
  if (!firestoreDb) {
    const current = loadVideosFromLocalStorage();
    const updated = current.filter((item) => item.id !== videoId);
    saveVideosToLocalStorage(updated);
    return;
  }

  await deleteDoc(doc(firestoreDb, COLLECTION, videoId));
}
