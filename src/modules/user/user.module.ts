import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerMiddleware } from "src/middleware/logger.middleware";
import { User } from "./user.entity";
import { AuthService } from "../auth/auth.service";
import { Repository } from "typeorm";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/guards/auth.guard";
import { UserRepository } from "./user.repository";
import { Post } from "../post/post.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User, Post])],
	controllers: [UserController],
	providers: [UserService, AuthService, UserRepository],
	exports: [UserService],
})
export class UserModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
