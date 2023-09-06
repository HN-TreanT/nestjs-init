import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./modules/user/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
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
				// host: "localhost",
				// port: +configService.get("DB_PORT"),
				// username: "admin",
				// password: "hnam23012002",
				// database: "nestjs",
				entities: [User],
				synchronize: true,
			}),
			inject: [ConfigService],
		}),
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
