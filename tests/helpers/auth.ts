import { Page } from '@playwright/test';

export async function mockGoogleAuth(page: Page) {
  const PROJECT_ID = 'shdzddzuweblkbdiyrhp'; // Your Supabase project ID

  // Set required cookies before any requests
  await page.context().addCookies([
    {
      name: `sb-${PROJECT_ID}-auth-token`,
      value: JSON.stringify({
        access_token: 'fake_access_token',
        refresh_token: 'fake_refresh_token',
        expires_at: Date.now() + 3600000,
        user: {
          id: 'fake_user_id',
          email: 'test@example.com',
          aud: 'authenticated',
          role: 'authenticated'
        }
      }),
      domain: 'localhost',
      path: '/',
    }
  ]);

  // Mock all Supabase auth endpoints
  await page.route('**/*auth/v1/**', async (route) => {
    const url = route.request().url();
    
    if (url.includes('/authorize')) {
      const callbackUrl = new URL('/auth/callback', 'http://localhost:3000');
      callbackUrl.searchParams.set('code', 'fake_auth_code');
      
      await route.fulfill({
        status: 302,
        headers: {
          'Location': callbackUrl.toString()
        }
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'fake_user_id',
            email: 'test@example.com',
            aud: 'authenticated',
            role: 'authenticated'
          },
          access_token: 'fake_access_token',
          refresh_token: 'fake_refresh_token'
        })
      });
    }
  });
}

export async function mockAuthFailure(page: Page) {
  // Mock Supabase auth failure
  await page.route('**/*auth/v1/**', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'invalid_request',
        error_description: 'Invalid OAuth request'
      })
    });
  });

  // Mock Google OAuth failure
  await page.route('**/oauth/v2/auth**', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'invalid_request',
        error_description: 'Invalid OAuth request'
      })
    });
  });
} 