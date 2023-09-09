import { Injectable } from "@nestjs/common";
import { PostReposirory } from "./post.repository";

@Injectable()
export class PostService {
	constructor(private readonly _postRepository: PostReposirory) {}
}
