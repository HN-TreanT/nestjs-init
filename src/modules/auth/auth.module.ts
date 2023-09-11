import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtContants } from "src/constants/jwtConstant";
import { MailModule } from "../mail/mail.module";

@Module({
	imports: [
		UserModule,
		JwtModule.register({
			global: true,
			secret: jwtContants.secret,
			signOptions: { expiresIn: "60s" },
		}),
		MailModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
