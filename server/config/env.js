import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'PORT'];

// Validate environment variables
export const validateEnv = () => {
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
};

export const PORT = process.env.PORT || 3001;
