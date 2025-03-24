import express from 'express';
import cors from 'cors';
import { validateEnv, PORT } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

// Validate environment variables
validateEnv();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
