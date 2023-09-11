import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import RegisterInfo from "../auth/dto/regiter-info.dto";

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}
	async sendUserConfirmation(user: RegisterInfo, token: string) {
		const url = "https://notiz.dev/blog/send-emails-with-nestjs";
		await this.mailerService.sendMail({
			to: user.email,
			subject: "Welcome to Nice App! Confirm your Email",
			template: "./welcome",
			context: {
				name: user.name,
				url,
				token,
			},
		});
	}
}
