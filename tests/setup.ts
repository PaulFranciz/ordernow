import * as dotenv from 'dotenv';
import path from 'path';

async function globalSetup() {
  // Load environment variables from .env.local
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.local')
  });

  // Verify required environment variables are present
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

export default globalSetup; 