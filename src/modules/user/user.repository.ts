import { Injectable } from "@nestjs/common";
import { WebRepository } from "src/models/Repository";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import UserReponse from "./dto/user-reponse";

@Injectable()
export class UserRepository extends WebRepository<User> {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {
		super(userRepository);
	}
	async findByEmail(email: string): Promise<User> {
		return this.userRepository.findOneBy({ email: email });
	}
}
