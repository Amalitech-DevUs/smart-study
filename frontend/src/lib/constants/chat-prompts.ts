// Quick starter prompts shown in the empty chat state.

export type QuickPrompt = {
  subject: string;
  prompt: string;
};

export const QUICK_CHAT_PROMPTS: QuickPrompt[] = [
  { subject: "Mathematics", prompt: "Solve: 2x + 5 = 15 step-by-step" },
  { subject: "Science", prompt: "Why do plants need chlorophyll for photosynthesis?" },
  { subject: "English", prompt: "What is the difference between active and passive voice?" },
  { subject: "Social Studies", prompt: "List the 3 arms of government in Ghana and their duties" },
];
