import { expect as baseExpect } from '@playwright/test';
import { FetchResponse } from 'api/clients/base-api-client';

export const expect = baseExpect.extend({
	toHaveStatusCode(response: FetchResponse, status: number): { pass: boolean; message: () => string } {
		let message: string;
		let pass: boolean;
		try {
			baseExpect(response.status).toBe(status);
			pass = true;
			message = 'Passed';
		} catch (error) {
			message = error.message;
			pass = false;
		}
		return { message: () => message, pass };
	},
});
