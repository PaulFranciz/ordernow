import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  globalSetup: require.resolve('./tests/setup.ts'),
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      env: {
        ...process.env,
        DOTENV_CONFIG_PATH: path.resolve(process.cwd(), '.env.local'),
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      DOTENV_CONFIG_PATH: path.resolve(process.cwd(), '.env.local'),
    },
  },
  reporter: process.env.CI ? 'github' : 'list',
};

export default config; 