import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { config } from './config.js';
import authRoutes from './routes/auth.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    data: 'FeedPulse API is healthy',
    error: null,
    message: 'API running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

mongoose.set('strictQuery', false);
mongoose
  .connect(config.mongoUri)
  .then(() => {
    app.listen(config.port, () => {
      console.log(`FeedPulse API listening on http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
