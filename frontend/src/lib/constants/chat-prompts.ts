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
  { subject: "Computing", prompt: "Explain the difference between RAM and ROM storage" },
  { subject: "RME", prompt: "What are the core moral teachings shared by Christianity and Islam?" },
  { subject: "French", prompt: "Comment conjuguer le verbe être au présent de l'indicatif?" },
  { subject: "Creative Arts", prompt: "Explain the primary and secondary color wheels in visual arts" },
  { subject: "Career Tech", prompt: "Explain the safety rules to observe when handling sharp cutting tools" },
  { subject: "ICT", prompt: "What are the differences between system software and application software?" },
];
