import { expect } from '@playwright/test';
import { test } from 'fixtures/test';

test('has title', async ({ page }) => {
	await page.goto('');
	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
	await page.goto('');

	// Click the get started link.
	await page.getByRole('link', { name: 'Get started' }).click();

	// Expects page to have a heading with the name of Installation.
	await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('check steps', async ({ page, landingPage, isMobile }) => {
	await landingPage.searchInDocs('Locator');

	await expect(page).toHaveTitle(/Locators/);
});
