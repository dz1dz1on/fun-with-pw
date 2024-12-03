import { Mobile } from '@decorators/platform';
import { step } from '@decorators/step';
import { LandingPage } from '@pages/landing/landing.page';

import { TIME } from 'utils/time';

@Mobile()
export class LandingMobilePage extends LandingPage {
	// in general this is done just for the check. It should show "...mobile docs" text as a result
	@step('Search phrase in the mobile docs')
	override async searchInDocs(phrase: string): Promise<void> {
		await this.searchBar.click();
		await this.docSearchInput.click();
		await this.docSearchInput.fill(phrase);
		await this.page.waitForTimeout(TIME.Short);
		await this.docSearchInput.press('Enter');
	}
}
