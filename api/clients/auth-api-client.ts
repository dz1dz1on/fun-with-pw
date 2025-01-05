import { APIRequestContext } from '@playwright/test';
import { ApiClient, FetchResponse, Headers } from 'api/clients/base-api-client';
import { components } from 'api/types/auth';
import { API_STATUSES } from 'api/utils/api-status';
import { expect } from 'api/utils/expect';

export type Auth = components['schemas']['Auth'];
export type Token = components['schemas']['Token'];

export class AuthApiClient extends ApiClient {
	constructor(request: APIRequestContext, headers: Headers) {
		super(request, headers, '/auth/');
	}

	async loginRaw(data: Auth): Promise<FetchResponse<Auth>> {
		return this.makeRequest<Auth>(`${this.baseEndpoint}login`, {
			method: 'POST',
			data,
		});
	}

	async login(data: Auth): Promise<FetchResponse> {
		const response = await this.loginRaw(data);
		expect(response).toHaveStatusCode(API_STATUSES.SUCCESSFUL_200);
		return response;
	}

	async loginAndReturnToken(data: Auth): Promise<string> {
		const response = await this.login(data);
		const setCookie = response.headers['set-cookie'];

		if (!setCookie) {
			throw new Error('Token not found in response headers');
		}

		const cookieValue = typeof setCookie === 'string' ? setCookie : setCookie[0];
		const tokenMatch = /token=([^;]+)/.exec(cookieValue);
		if (!tokenMatch) {
			throw new Error('Token format not recognized in cookie');
		}

		const token = tokenMatch[1].replace(/^token=/, '');
		return token;
	}

	async validateToken(token: string): Promise<FetchResponse<Token>> {
		const response = await this.makeRequest<Token>(`${this.baseEndpoint}validate`, {
			method: 'POST',
			data: { token },
		});

		if (!response.data?.token) {
			throw new Error('Invalid token response from server');
		}

		return response;
	}

	async clearToken(token: string): Promise<FetchResponse<Token>> {
		return this.makeRequest<Token>(`${this.baseEndpoint}logout`, {
			method: 'POST',
			data: { token },
		});
	}
}

export function createAuthApiClient(request: APIRequestContext, token = '', cookies = ''): AuthApiClient {
	const config: Headers = {
		'X-api-version': '1.0',
		'content-type': 'application/json;charset=UTF-8',
		Cookie: cookies ? `token=${cookies}` : '',
		Authorization: token ? `Bearer ${token}` : '',
	};

	return new AuthApiClient(request, config);
}

export async function loginUserAndGetToken(request: APIRequestContext, user: Auth): Promise<string> {
	const authApiClient = createAuthApiClient(request);
	const token = await authApiClient.loginAndReturnToken(user);
	return token;
}
