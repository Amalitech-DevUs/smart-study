import { Router, Request, Response } from 'express';

const router = Router();

// Mock Question Bank data contract
const mockQuestions = [
  {
    id: 'q1',
    subject: 'Integrated Science',
    year: 2023,
    topic: 'Photosynthesis',
    prompt: 'Which gas is released during photosynthesis?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    correctAnswer: 'Oxygen'
  },
  {
    id: 'q2',
    subject: 'Mathematics',
    year: 2022,
    topic: 'Algebra',
    prompt: 'Solve for x: 2x + 5 = 15',
    options: ['x = 3', 'x = 5', 'x = 10', 'x = 7'],
    correctAnswer: 'x = 5'
  },
  {
    id: 'q3',
    subject: 'Social Studies',
    year: 2023,
    topic: 'Governance',
    prompt: 'What is the organ of government responsible for law making in Ghana?',
    options: ['Judiciary', 'Executive', 'Legislature', 'District Assembly'],
    correctAnswer: 'Legislature'
  }
];

// GET /questions - Fetch question flashcards with optional query filtering
router.get('/', (req: Request, res: Response) => {
  const { subject, year, topic } = req.query;

  let result = mockQuestions;
  if (subject) {
    result = result.filter(q => q.subject.toLowerCase() === (subject as string).toLowerCase());
  }
  if (year) {
    result = result.filter(q => q.year === Number(year));
  }
  if (topic) {
    result = result.filter(q => q.topic.toLowerCase().includes((topic as string).toLowerCase()));
  }

  res.json({
    success: true,
    data: result,
    meta: {
      count: result.length,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /questions/:id - Fetch single question by ID
router.get('/:id', (req: Request, res: Response) => {
  const question = mockQuestions.find(q => q.id === req.params.id);
  if (!question) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'QUESTION_NOT_FOUND',
        message: `Question with ID ${req.params.id} was not found`
      }
    });
  }

  res.json({
    success: true,
    data: question
  });
});

export default router;
