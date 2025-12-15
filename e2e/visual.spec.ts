import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match desktop homepage screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await expect(page).toHaveScreenshot('desktop-homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match mobile homepage screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('mobile-homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match desktop search results screenshot', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search for pairs/i);
    await searchInput.fill('ETH');
    await searchInput.press('Enter');
    
    // Wait for loading to complete
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveScreenshot('desktop-search-results.png', {
      fullPage: true,
      animations: 'disabled',
      mask: [page.locator('[class*="animate"]')],
    });
  });

  test('should match mobile search results screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search for pairs/i);
    await searchInput.fill('ETH');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveScreenshot('mobile-search-results.png', {
      fullPage: true,
      animations: 'disabled',
      mask: [page.locator('[class*="animate"]')],
    });
  });

  test('should match dark mode screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Click theme toggle to switch to dark mode
    const themeButton = page.locator('button[aria-label*="theme" i]').first();
    await themeButton.click();
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('desktop-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match French language screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Switch to French
    const frenchButton = page.getByRole('button', { name: /français/i });
    await frenchButton.click();
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('desktop-french.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match tablet viewport screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('tablet-homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match error state screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Mock API to return error
    await page.route('**/api.dexscreener.com/**', (route) => {
      route.abort('failed');
    });
    
    const searchInput = page.getByPlaceholder(/search for pairs/i);
    await searchInput.fill('TEST');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveScreenshot('desktop-error-state.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match empty state screenshot', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Initial empty state
    await expect(page).toHaveScreenshot('desktop-empty-state.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
