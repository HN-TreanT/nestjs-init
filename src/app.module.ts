import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./modules/user/user.entity";
import { Post } from "./modules/post/post.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerModule } from "./logger/logger.module";
import { AllExceptionFilter } from "./filter/exception.filter";
import { PostModule } from "./modules/post/post.module";
import { CatModule } from "./modules/cat/cat.module";
import { MailModule } from "./modules/mail/mail.module";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { BullModule } from "@nestjs/bull";
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env",
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				type: "mysql",
				host: configService.get("DB_HOST"),
				port: +configService.get("DB_PORT"),
				username: configService.get("DB_USERNAME"),
				password: configService.get("DB_PASSWORD"),
				database: configService.get("DB_DATABASE_NAME"),
				entities: [User, Post],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		// CacheModule.register({
		// 	store:redisStore,
		// 	host:"localhost",
		// 	port:6379
			
		// }),
		BullModule.forRoot({
			redis:{
				host:'localhost',
				port:6379
			}
		}),
		UserModule,
		AuthModule,
		LoggerModule,
		PostModule,
		CatModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionFilter,
		}

	],
})
export class AppModule {}
