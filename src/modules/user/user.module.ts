import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerMiddleware } from "src/middleware/logger.middleware";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { Post } from "../post/post.entity";
import { CacheModule, CacheStore } from "@nestjs/cache-manager";
import { MailModule } from "../mail/mail.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as redisStore from "cache-manager-redis-store";
import {HttpModule} from "@nestjs/axios"
@Module({
	imports: [
		TypeOrmModule.forFeature([User, Post]),
		CacheModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
			    // ttl:5,
				store: redisStore,
				// host: configService.get<string>("REDIS_HOST"),
				// port: configService.get<number>("REDIS_PORT"),
				// username: configService.get<string>("REDIS_USERNAME"),
				// password: configService.get<string>("REDIS_PASSWORD"),
				host:'localhost',
				port:6379
			}),
		}),
		// CacheModule.register({}),
		HttpModule.register({}),
		MailModule,
	],
	controllers: [UserController],
	providers: [UserService, UserRepository],
	exports: [UserService],
})
export class UserModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
