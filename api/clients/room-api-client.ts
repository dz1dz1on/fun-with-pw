import { APIRequestContext } from '@playwright/test';
import { ApiClient, FetchResponse, Headers } from 'api/clients/base-api-client';
import { components } from 'api/types/room';
import { API_STATUSES } from 'api/utils/api-status';
import { expect } from 'api/utils/expect';

interface RoomQueryParams {
	[key: string]: string | boolean | undefined;
	roomName?: string;
	type?: string;
	accessible?: boolean;
}

export type Room = components['schemas']['Room'];
export type Rooms = components['schemas']['Rooms'];

export class RoomApiClient extends ApiClient {
	constructor(request: APIRequestContext, config: Headers) {
		super(request, config, '/room/');
	}

	async getRoomsRaw(params?: RoomQueryParams): Promise<FetchResponse<Rooms>> {
		return this.makeRequest<Rooms>(`${this.baseEndpoint}`, { method: 'GET', params });
	}

	async getRooms(params?: RoomQueryParams): Promise<Rooms> {
		const response = await this.getRoomsRaw(params);
		expect(response).toHaveStatusCode(API_STATUSES.SUCCESSFUL_200);
		return response.data;
	}

	async getRoomRaw(id: number): Promise<FetchResponse<Room>> {
		const response = await this.makeRequest<Room>(`${this.baseEndpoint}${id}}`, {
			method: 'GET',
		});
		return response;
	}

	async getRoom(id: number): Promise<Room> {
		const response = await this.getRoomRaw(id);
		expect(response).toHaveStatusCode(API_STATUSES.SUCCESSFUL_200);
		return response.data;
	}

	async createRoomRaw(data: Room): Promise<FetchResponse<Room>> {
		return this.makeRequest<Room>(this.baseEndpoint, {
			method: 'POST',
			data,
		});
	}

	async createRoom(data: Room): Promise<Room> {
		const response = await this.createRoomRaw(data);
		expect(response).toHaveStatusCode(API_STATUSES.CREATED_201);
		return response.data;
	}

	async updateRoomRaw(id: number, data: Room): Promise<FetchResponse<Room>> {
		return this.makeRequest<Room>(`${this.baseEndpoint}${id}`, {
			method: 'PUT',
			data,
		});
	}

	async updateRoom(id: number, data: Room): Promise<Room> {
		const response = await this.updateRoomRaw(id, data);
		expect(response).toHaveStatusCode(API_STATUSES.SUCCESSFUL_200);
		return response.data;
	}

	async deleteRoomRaw(id: number): Promise<FetchResponse<null>> {
		return this.makeRequest<null>(`${this.baseEndpoint}${id}`, {
			method: 'DELETE',
		});
	}

	async deleteRoom(id: number): Promise<void> {
		const response = await this.deleteRoomRaw(id);
		expect(response).toHaveStatusCode(API_STATUSES.ACCEPTED_202);
	}
}
