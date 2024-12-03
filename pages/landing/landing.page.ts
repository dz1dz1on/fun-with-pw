import { Web } from '@decorators/platform';
import { step } from '@decorators/step';
import { Page } from '@playwright/test';
import { TIME } from 'utils/time';

@Web()
export class LandingPage {
	readonly searchBar = this.page.getByLabel('Search');
	readonly docSearchInput = this.page.locator('#docsearch-input');

	constructor(protected page: Page) {}

	@step('Search phrase in the docs')
	async searchInDocs(phrase: string): Promise<void> {
		await this.searchBar.click();
		await this.docSearchInput.click();
		await this.docSearchInput.fill(phrase);
		await this.page.waitForTimeout(TIME.Short);
		await this.docSearchInput.press('Enter');
	}
}
