import { test, expect } from '@playwright/test';
import { mockGoogleAuth, mockAuthFailure } from '../helpers/auth';

test.describe('Sign In Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from home page
    await page.goto('/auth/signin');
  });

  test('should handle Google sign in and redirect to checkout', async ({ page }) => {
    // Set up auth mocks
    await mockGoogleAuth(page);

    // Wait for and click the sign in button
    const signInButton = page.getByRole('button', { name: /Continue with Google/i });
    await signInButton.waitFor({ state: 'visible' });
    await signInButton.click({ force: true });

    // Wait for navigation to complete
    await page.waitForNavigation();
    
    // Verify we're on the checkout page
    expect(page.url()).toContain('/checkout');
  });

  test('should show error toast on sign in failure', async ({ page }) => {
    // Set up auth failure mock
    await mockAuthFailure(page);

    // Click sign in button
    const signInButton = page.getByRole('button', { name: /Continue with Google/i });
    await signInButton.waitFor({ state: 'visible' });
    await signInButton.click({ force: true });

    // Wait for error toast using a more reliable approach
    await expect(async () => {
      const toastText = await page.textContent('.go2072408551');
      expect(toastText).toContain('Failed to sign in with Google');
    }).toPass({
      timeout: 10000,
      intervals: [1000, 2000, 5000] // Retry with increasing intervals
    });
  });

  test('should redirect to signin when accessing protected route', async ({ page }) => {
    // Try to access checkout directly
    await page.goto('/checkout');

    // Should be redirected to signin with returnTo parameter
    await expect(page).toHaveURL(/\/auth\/signin\?returnTo=%2Fcheckout/, { timeout: 10000 });
  });
}); 