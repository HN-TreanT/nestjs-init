import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as path from "path";
import { BullModule } from "@nestjs/bull";
import { EmailConsumer } from "./consumer/email.consumer";
@Module({
	imports: [
		ConfigModule,
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get("MAIL_HOST"),
					secure: false,
					auth: {
						user: config.get("MAIL_USER"),
						pass: config.get("MAIL_PASS"),
					},
				},
				defaults: {
					from: `"No reply" ${config.get("MAIL_FROM")}`,
				},
				template: {
					dir: path.join(__dirname, "..", "..", "src/templates/email"),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
		BullModule.registerQueue({
			name:"send-mail"
		})
	],
	providers: [MailService,EmailConsumer],
	exports: [MailService],
})
export class MailModule {}
