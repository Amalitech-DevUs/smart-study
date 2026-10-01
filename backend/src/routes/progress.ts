import { Router, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

const DATA_DIR = path.resolve(__dirname, '../data');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

export interface UserProgressData {
  attempts: Array<{
    id: string;
    questionId: string;
    subject: string;
    subjectSlug: string;
    topic: string;
    year?: number;
    paper?: number;
    mode: 'practice' | 'test';
    isCorrect: boolean;
    selectedOptionId: string | null;
    correctOptionId: string;
    isRequeued: boolean;
    attemptNumber: number;
    timestamp: number;
    sessionId: string;
  }>;
  sessions: Array<{
    sessionId: string;
    sessionKey: string;
    subject: string;
    subjectSlug: string;
    year: number;
    mode: 'practice' | 'test';
    startedAt: number;
    completedAt: number;
    isCompleted: boolean;
    uniqueQuestionsTotal: number;
    uniqueQuestionsCompleted: number;
    totalAttempts: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    scorePercent: number;
    timeSpentSeconds?: number;
  }>;
  lastUpdated: number;
}

type ProgressStore = Record<string, UserProgressData>;

function getProgressStore(): ProgressStore {
  try {
    if (!fs.existsSync(PROGRESS_FILE)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(PROGRESS_FILE, '{}', 'utf8');
      return {};
    }
    const content = fs.readFileSync(PROGRESS_FILE, 'utf8');
    return JSON.parse(content || '{}');
  } catch (err) {
    console.error('Error reading progress store:', err);
    return {};
  }
}

function saveProgressStore(store: ProgressStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving progress store:', err);
  }
}

// GET /progress - Retrieve user's study sessions and question attempts
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const username = req.user?.username?.toLowerCase();
  if (!username) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const store = getProgressStore();
  const userProgress = store[username] || { attempts: [], sessions: [], lastUpdated: 0 };

  return res.json({
    success: true,
    data: userProgress,
  });
});

// POST /progress/sync - Merge client-side attempts & sessions with backend storage
router.post('/sync', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const username = req.user?.username?.toLowerCase();
  if (!username) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { attempts = [], sessions = [] } = req.body || {};

  const store = getProgressStore();
  const existing = store[username] || { attempts: [], sessions: [], lastUpdated: 0 };

  // Merge attempts by unique ID or questionId+timestamp
  const attemptMap = new Map<string, (typeof attempts)[0]>();
  for (const att of existing.attempts) {
    const key = att.id || `${att.questionId}_${att.timestamp}`;
    attemptMap.set(key, att);
  }
  for (const att of attempts) {
    const key = att.id || `${att.questionId}_${att.timestamp}`;
    attemptMap.set(key, att);
  }
  const mergedAttempts = Array.from(attemptMap.values());

  // Merge sessions by sessionId
  const sessionMap = new Map<string, (typeof sessions)[0]>();
  for (const sess of existing.sessions) {
    sessionMap.set(sess.sessionId, sess);
  }
  for (const sess of sessions) {
    sessionMap.set(sess.sessionId, sess);
  }
  const mergedSessions = Array.from(sessionMap.values()).sort(
    (a, b) => (b.completedAt || 0) - (a.completedAt || 0)
  );

  const updatedUserData: UserProgressData = {
    attempts: mergedAttempts,
    sessions: mergedSessions,
    lastUpdated: Date.now(),
  };

  store[username] = updatedUserData;
  saveProgressStore(store);

  return res.json({
    success: true,
    data: updatedUserData,
  });
});

export default router;
