import { z } from 'zod';

// ==========================================
// Authentication Schemas
// ==========================================
export const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  pin: z.string().regex(/^\d{4,6}$/, 'PIN must be a 4 to 6 digit numeric code')
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  pin: z.string().min(1, 'PIN is required')
});

// ==========================================
// Question Bank Schemas
// ==========================================
export const questionsQuerySchema = z.object({
  subject: z.string().optional(),
  year: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().min(1900).max(2100)).optional(),
  topic: z.string().optional()
});

export const questionIdParamsSchema = z.object({
  id: z.string().min(1, 'Question ID is required')
});

// ==========================================
// Article Schemas
// ==========================================
export const articlesQuerySchema = z.object({
  category: z.string().optional()
});

export const articleIdParamsSchema = z.object({
  id: z.string().min(1, 'Article ID is required')
});

// ==========================================
// AI Assistant Chat Schemas
// ==========================================
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message payload cannot be empty').max(2000, 'Message exceeds 2000 character limit'),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string()
    })
  ).optional()
});

// ==========================================
// Progress Tracking Schemas
// ==========================================
export const progressAttemptSchema = z.object({
  attempts: z.array(
    z.object({
      questionId: z.string().min(1),
      result: z.enum(['correct', 'incorrect', 'skipped']),
      attemptsTaken: z.number().int().min(1),
      timestamp: z.string().optional()
    })
  ).min(1, 'At least one attempt must be submitted')
});
