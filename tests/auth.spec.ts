import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from home page
    await page.goto('/');
  });

  test('should redirect to checkout after successful Google sign-in', async ({ page }) => {
    // Mock Google OAuth response
    await page.route('**/auth/v1/authorize**', async (route) => {
      const url = new URL(route.request().url());
      const callbackUrl = new URL('/auth/callback', url.origin);
      callbackUrl.searchParams.set('code', 'fake_code');
      await route.fulfill({
        status: 302,
        headers: {
          'Location': callbackUrl.toString()
        }
      });
    });

    // Mock Supabase exchange code for session
    await page.route('**/auth/v1/token**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'fake_access_token',
          refresh_token: 'fake_refresh_token',
          expires_in: 3600,
          token_type: 'bearer'
        })
      });
    });

    // Click sign in button
    await page.click('text=Continue with Google');

    // Should be redirected to checkout
    await expect(page).toHaveURL('/checkout');
  });

  test('should show error toast on sign-in failure', async ({ page }) => {
    // Mock Google OAuth error
    await page.route('**/auth/v1/authorize**', async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({
          error: 'invalid_request',
          error_description: 'Invalid OAuth request'
        })
      });
    });

    // Click sign in button
    await page.click('text=Continue with Google');

    // Should show error toast
    await expect(page.locator('text=Failed to sign in with Google')).toBeVisible();
  });

  test('should redirect to signin when accessing protected route', async ({ page }) => {
    // Try to access checkout directly
    await page.goto('/checkout');

    // Should be redirected to signin with returnTo parameter
    await expect(page).toHaveURL('/auth/signin?returnTo=/checkout');
  });
}); 