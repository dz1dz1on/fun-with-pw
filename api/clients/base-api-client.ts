import { APIRequestContext } from '@playwright/test';
import config from '../playwright.config';

export type QueryParams = Record<string, string | number | boolean | undefined>;
export type Headers = Record<string, string>;

export interface FetchOptions<T = unknown> {
	method: 'PUT' | 'POST' | 'GET' | 'DELETE';
	headers?: Headers;
	data?: T;
	params?: QueryParams;
}

export interface FetchResponse<T = unknown> {
	status: number;
	statusText: string;
	data: T;
	headers: Record<string, string>;
}

export class ApiClient {
	constructor(
		protected request: APIRequestContext,
		protected configHeaders: Headers,
		protected baseEndpoint: string
	) {}

	protected async makeRequest<T>(endpoint: string, options: FetchOptions<T>): Promise<FetchResponse<T>> {
		const { method, headers = {}, data } = options;
		const url = this.buildUrl(endpoint, options?.params);

		const response = await this.request.fetch(url, {
			method,
			headers: {
				...this.configHeaders,
				...headers,
			},
			data: data !== undefined ? JSON.stringify(data) : undefined,
		});

		const responseData = (await response.json().catch(() => null)) as T;
		const responseHeaders = response.headers();

		return {
			status: response.status(),
			statusText: response.statusText(),
			data: responseData,
			headers: responseHeaders,
		};
	}

	private buildUrl(endpoint: string, queryParams?: QueryParams): string {
		const baseURL = config.use?.baseURL;
		if (!baseURL) throw new Error('baseURL is not defined in the Playwright config');

		// Create the base URL
		const url = new URL(endpoint, baseURL);

		// Add query parameters if provided
		if (queryParams) {
			Object.entries(queryParams).forEach(([key, value]) => {
				url.searchParams.append(key, String(value));
			});
		}

		return url.toString();
	}
}
