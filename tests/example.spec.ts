import { test as base, expect } from '@playwright/test';
import { LandingPage } from 'pages/Landing.page';

const test = base.extend<{ landingPage: LandingPage }>({
	landingPage: async ({ page }, use) => {
		const ladingPage = new LandingPage(page);
		await page.goto('');

		await use(ladingPage);
	},
});

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

test('check steps', async ({ page, landingPage }) => {
	await landingPage.searchInDocs('Locator');

	await expect(page).toHaveTitle(/Locators/);
});
