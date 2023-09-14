import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import RegisterInfo from "../auth/dto/regiter-info.dto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService,
	@InjectQueue("send-mail") private sendMail: Queue
		) {}
	async sendUserConfirmation(user: RegisterInfo, token: string) {
		const url = "https://notiz.dev/blog/send-emails-with-nestjs";
		await this.sendMail.add('register',{name:user.name,url:url, token:token,email: user.email },{removeOnComplete: true}) 
	
	}
}
