import { Injectable, NotFoundException } from "@nestjs/common";
import { Like, Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Paging } from "src/common/paging";
import { PagedData } from "src/models/PagedData";
import UserUpdate from "./dto/user-update";
import UserCreate from "./dto/user-create";
import { UserRepository } from "./user.repository";
import UserReponse from "./dto/user-reponse";
@Injectable()
export class UserService {
	constructor(private readonly _userRepository: UserRepository) {}

	async findAll(
		search: string,
		paging: Paging,
	): Promise<PagedData<User> | null> {
		const [results, total] = await this._userRepository.getList(
			{
				name: Like(`%${search ? search : ""}%`),
			},
			paging,
		);

		return new PagedData<User>(paging.pageNumber, total, results);
	}
	async getById(id: any): Promise<User> {
		return this._userRepository.findById(id);
	}
	async findByEmail(email: string): Promise<User> {
		const user = await this._userRepository.findByEmail(email);
		return user;
	}
	create(req: UserCreate) {
		return this._userRepository.create(req);
	}
	async update(id: number, req: UserUpdate) {
		let user = await this._userRepository.findById({ id: id });
		if (!user) {
			throw new NotFoundException("user does not exist");
		}
		await this._userRepository.update(id, req);
		return user;
	}

	async delete(id: number) {
		return this._userRepository.deleteById(id);
	}
}
