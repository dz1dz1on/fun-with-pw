import { test as base } from '@playwright/test';
import { Auth, AuthApiClient, createAuthApiClient, loginUserAndGetToken } from 'api/clients/auth-api-client';
import { createRoomsApiClient, RoomApiClient } from 'api/clients/room-api-client';

interface ApiFixtures {
	roomsApiClient: RoomApiClient;
	authApiClient: AuthApiClient;
}

export const test = base.extend<ApiFixtures>({
	roomsApiClient: async ({ request }, use) => {
		const user: Auth = {
			username: 'admin',
			password: 'password',
		};
		const token = await loginUserAndGetToken(request, user);
		const cookies = `token=${token}`;
		const roomsApiClient = createRoomsApiClient(request, cookies, '');
		await use(roomsApiClient);
	},
	authApiClient: async ({ request }, use) => {
		const authApiClient = createAuthApiClient(request);
		await use(authApiClient);
	},
});
