import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { CatController } from "./cat.controller";

@Module({
	imports: [ConfigModule],
	controllers: [CatController],
	providers: [
		{
			provide: "CAT_SERVICE",
			useFactory: (configService: ConfigService) => {
				return ClientProxyFactory.create({
					transport: Transport.TCP,
					options: {
						host: "localhost",
						port: 8000,
					},
				});
			},
			inject: [ConfigService],
		},
	],
})
export class CatModule {}
