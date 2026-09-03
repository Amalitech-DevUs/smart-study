import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import questionsRoutes from './routes/questions';
import articlesRoutes from './routes/articles';
import chatRoutes from './routes/chat';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Frontend React app
app.use(cors());

// Global JSON body parser
app.use(express.json());

// API Base Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    app: 'Smart-Study BECE Learning Platform API',
    role: 'Backend API & Orchestration Layer',
    status: 'Running',
    version: '1.0.0',
    documentation: '/health/auth, /questions, /articles, /chat'
  });
});

// Route Handlers
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/questions', questionsRoutes);
app.use('/articles', articlesRoutes);
app.use('/chat', chatRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` 🚀 Smart-Study Backend API Server running on port ${PORT}`);
  console.log(` 🏥 Health checks: http://localhost:${PORT}/health/content`);
  console.log(` 🎴 Questions API: http://localhost:${PORT}/questions`);
  console.log(` 📰 Articles API:  http://localhost:${PORT}/articles`);
  console.log(` 💬 AI Chat API:   http://localhost:${PORT}/chat`);
  console.log(`====================================================`);
});

export default app;
