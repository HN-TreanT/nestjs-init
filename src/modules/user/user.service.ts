import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Paging } from "src/common/paging";
import { PagedData } from "src/models/PagedData";
import UserUpdate from "./dto/user-update";
import UserCreate from "./dto/user-create";
import { skip } from "node:test";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private _userRepository: Repository<User>,
	) {}

	async findAll(paging: Paging): Promise<PagedData<User> | null> {
		const [results, total] = await this._userRepository.findAndCount({
			skip: (paging.pageNumber - 1) * paging.pageSize,
			take: paging.pageSize,
		});
		return new PagedData<User>(paging.pageNumber, total, results);
	}
	async findByEmail(email: string): Promise<User> {
		const user = await this._userRepository.findOneBy({ email: email });
		return user;
	}
	create(req: UserCreate) {
		const user = this._userRepository.create(req);
		return this._userRepository.save(user);
	}
	async update(id: number, req: UserUpdate) {
		let user = await this._userRepository.findOneBy({ id: id });
		if (!user) {
			throw new NotFoundException("user does not exist");
		}
		user = { ...user, ...req };
		return this._userRepository.save(user);
	}
}
