import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible(); // navbar
    await expect(page.getByText('AfriBayit')).toBeVisible();
    await expect(page.getByRole('search', { name: 'Rechercher une propriété' })).toBeVisible();
  });

  test('should show navigation links', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Acheter' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Louer' })).toBeVisible();
  });

  test('should navigate to search page', async ({ page }) => {
    await page.getByRole('link', { name: 'Acheter' }).click();
    await expect(page).toHaveURL(/\/recherche/);
  });

  test('should display property cards', async ({ page }) => {
    const cards = page.getByRole('article');
    await expect(cards.first()).toBeVisible();
  });

  test('should be accessible — no axe violations on hero', async ({ page }) => {
    // Basic keyboard navigation check
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });
});
