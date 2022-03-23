import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	async createUser(dto: AuthDto) {}

	async findUser() {}
}
