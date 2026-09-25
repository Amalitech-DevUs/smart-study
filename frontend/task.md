# Refactor Task Tracker

## Phase 1 — Constants & Shared Data
- [x] `lib/constants/subjects.ts` — canonical subject config
- [x] `lib/constants/navigation.ts` — shared nav links
- [x] `lib/constants/chat-prompts.ts` — quickSubjects for message-list
- [x] `lib/session-utils.ts` — formatTime, isSafeToShuffle, shuffleOptionsSafely, parseQuestionPrompt

## Phase 2 — Dashboard Decomposition
- [x] `hooks/use-dashboard-data.ts` — data loading hook
- [x] `components/dashboard/DashboardHeader.tsx`
- [x] `components/dashboard/ContinueLearning.tsx`
- [x] `components/dashboard/LearningOverview.tsx`
- [x] `components/dashboard/SubjectCard.tsx`
- [x] `components/dashboard/SubjectsSection.tsx`
- [x] `components/dashboard/FocusAreas.tsx`
- [x] `components/dashboard/RecentActivity.tsx`
- [x] `components/dashboard/DailyGoalCard.tsx`
- [x] `components/dashboard/AiTutorCard.tsx`
- [x] `components/dashboard/QuickActionsCard.tsx`
- [x] `app/dashboard/page.tsx` — refactored to orchestrator (from 773 lines to 98 lines)

## Phase 3 — Session Runner Decomposition
- [x] `components/flashcards/SessionHeader.tsx`
- [x] `components/flashcards/PracticeSummary.tsx`
- [x] `components/flashcards/TestReviewScreen.tsx`
- [x] `components/flashcards/SubmitConfirmModal.tsx`
- [x] `components/flashcards/session-runner.tsx` — refactored (from 1019 lines to 430 lines)

## Phase 4 — McqCard Cleanup
- [x] `components/flashcards/FormattedExamText.tsx`
- [x] `components/flashcards/FormattedAiContent.tsx`
- [x] `components/flashcards/AnswerOption.tsx`
- [x] `components/flashcards/PracticeFeedback.tsx`
- [x] `components/flashcards/ReviewFeedback.tsx`
- [x] `components/flashcards/mcq-card.tsx` — refactored (from 912 lines to 290 lines)

## Phase 5 — Chat Cleanup
- [x] `components/chat/FormattedMessageContent.tsx`
- [x] `components/chat/EmptyChatState.tsx`
- [x] `components/chat/StudentMessageBubble.tsx`
- [x] `components/chat/AiMessageCard.tsx`
- [x] `components/chat/message-list.tsx` — refactored (from 505 lines to 98 lines)

## Phase 6 — Dead Code & Shared Nav
- [x] Delete `top-nav.tsx`
- [x] Delete `bottom-nav.tsx`
- [x] Delete `nav-items.ts`
- [x] Update `hamburger-drawer.tsx` to use shared nav
- [x] Update `side-nav.tsx` to use shared nav

## Phase 7 — Profile & Landing Page Decomposition
- [x] `components/profile/ProfileIdentitySection.tsx`
- [x] `components/profile/AccountInfoSection.tsx`
- [x] `components/profile/ProfileLearningSection.tsx`
- [x] `components/profile/ProfileResourcesSection.tsx`
- [x] `app/profile/page.tsx` — refactored to clean orchestrator
- [x] `components/landing/FeaturesSection.tsx`
- [x] `components/landing/CurriculumSection.tsx`
- [x] `components/landing/AiTutorShowcase.tsx`
- [x] `components/landing/LandingCta.tsx`
- [x] `app/page.tsx` — refactored to clean orchestrator (from 252 lines to 24 lines)

## Phase 8 — Verification
- [x] `npm run build` passed with exit code 0
- [x] All 17 routes compiled successfully
- [x] Zero TypeScript errors
