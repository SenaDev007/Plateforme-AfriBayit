import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/connexion');
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Facebook/i })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/connexion');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('registration stepper renders step 1', async ({ page }) => {
    await page.goto('/inscription');
    await expect(page.getByRole('heading', { name: 'Créer votre compte' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('can advance to step 2 with valid data', async ({ page }) => {
    await page.goto('/inscription');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Mot de passe').first().fill('Password123');
    await page.getByLabel('Confirmer le mot de passe').fill('Password123');
    await page.getByRole('button', { name: /Continuer/i }).click();
    await expect(page.getByText('Votre profil')).toBeVisible();
  });
});
