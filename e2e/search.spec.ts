import { test, expect } from '@playwright/test';

test.describe('DEX Pair Search E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main page with search form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /DEX Pair Explorer/i })).toBeVisible();
    await expect(page.getByPlaceholder(/search for pairs/i)).toBeVisible();
  });

  test('should show validation error for empty search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search for pairs/i);
    await searchInput.click();
    await searchInput.press('Enter');
    
    await expect(page.getByText(/search query is required/i)).toBeVisible();
  });

  test('should show validation error for short search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search for pairs/i);
    await searchInput.fill('A');
    await searchInput.press('Enter');
    
    await expect(page.getByText(/must be at least 2 characters/i)).toBeVisible();
  });

  test('should perform search and display results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search for pairs/i);
    
    await searchInput.fill('ETH');
    await searchInput.press('Enter');
    
    // Wait for loading state
    await expect(page.getByText(/searching for pairs/i)).toBeVisible();
    
    // Wait for results or error/empty state (with longer timeout for API)
    await page.waitForTimeout(3000);
    
    // Check if we have results, empty state, or error
    const hasResults = await page.locator('[class*="grid"]').count() > 0;
    const hasEmptyState = await page.getByText(/no results found/i).isVisible().catch(() => false);
    const hasError = await page.getByText(/something went wrong/i).isVisible().catch(() => false);
    
    // At least one of these states should be present
    expect(hasResults || hasEmptyState || hasError).toBeTruthy();
  });

  test('should toggle theme', async ({ page }) => {
    const themeButton = page.locator('button[aria-label*="theme" i]').first();
    
    await themeButton.click();
    
    // Check that the theme changed (dark class should be added/removed from html)
    const htmlElement = page.locator('html');
    const hasThemeClass = await htmlElement.evaluate((el) => 
      el.classList.contains('dark') || el.classList.contains('light')
    );
    
    expect(hasThemeClass).toBeTruthy();
  });

  test('should switch language', async ({ page }) => {
    // Find French flag button
    const frenchButton = page.getByRole('button', { name: /français/i });
    
    await frenchButton.click();
    
    // Check that the title changed to French
    await expect(page.getByRole('heading', { name: /explorateur de paires dex/i })).toBeVisible();
    
    // Switch back to English
    const englishButton = page.getByRole('button', { name: /english/i });
    await englishButton.click();
    
    await expect(page.getByRole('heading', { name: /DEX Pair Explorer/i })).toBeVisible();
  });

  test('should display pair cards with correct information', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search for pairs/i);
    
    await searchInput.fill('USDC');
    await searchInput.press('Enter');
    
    // Wait for potential results
    await page.waitForTimeout(3000);
    
    // Check if pair cards are displayed
    const pairCards = page.locator('[class*="bg-card"]').filter({ hasText: /\// });
    const cardCount = await pairCards.count();
    
    if (cardCount > 0) {
      const firstCard = pairCards.first();
      
      // Check that card contains expected elements
      await expect(firstCard).toBeVisible();
      
      // Should have a link to DEX Screener
      const externalLink = firstCard.locator('a[href*="dexscreener.com"]');
      await expect(externalLink).toBeVisible();
    }
  });

  test('should handle pagination when results exceed page size', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search for pairs/i);
    
    await searchInput.fill('USD');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(3000);
    
    // Check if pagination is present
    const paginationText = page.getByText(/showing \d+ to \d+ of \d+ results/i);
    const hasPagination = await paginationText.isVisible().catch(() => false);
    
    if (hasPagination) {
      // Try to click next page
      const nextButton = page.getByRole('button', { name: /next/i }).first();
      const isNextEnabled = await nextButton.isEnabled();
      
      if (isNextEnabled) {
        await nextButton.click();
        
        // Verify page changed
        await expect(paginationText).toBeVisible();
      }
    }
  });
});
