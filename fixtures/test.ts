import { LandingPage } from '@pages/landing';
import { test as base } from '@playwright/test';

export const test = base.extend<{ landingPage: LandingPage }>({
	landingPage: async ({ page }, use) => {
		const ladingPage = new LandingPage(page);
		await page.goto('');

		await use(ladingPage);
	},
	isMobile: async ({ isMobile }, use) => {
		global.IS_MOBILE = isMobile;
		await use(isMobile);
	},
});
