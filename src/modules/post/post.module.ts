import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { LoggerMiddleware } from "src/middleware/logger.middleware";
import { User } from "../user/user.entity";
import { PostReposirory } from "./post.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Post, User])],
	controllers: [PostController],
	providers: [PostService, PostReposirory],
	exports: [PostService],
})
export class PostModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
