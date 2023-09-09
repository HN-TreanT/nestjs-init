import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebRepository } from "src/models/Repository";
import { Repository } from "typeorm";
import { Post } from "./post.entity";

@Injectable()
export class PostReposirory extends WebRepository<Post> {
	constructor(
		@InjectRepository(Post) private readonly postRepository: Repository<Post>,
	) {
		super(postRepository);
	}
}
