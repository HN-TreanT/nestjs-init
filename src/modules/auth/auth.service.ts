import {
	Injectable,
	UnauthorizedException,
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import RegisterInfo from "./dto/regiter-info.dto";
import * as bcrypt from "bcrypt";
import { jwtContants } from "src/constants/jwtConstant";
import { MailService } from "../mail/mail.service";

const saltOrRounds = 10;
@Injectable()
export class AuthService {
	constructor(
		private readonly _userService: UserService,
		private jwtService: JwtService,
		private _mailService: MailService,
	) {}
	async signIn(email: string, password: string): Promise<any> {
		const user = await this._userService.findByEmail(email);
		if (!user) {
			throw new NotFoundException("user does not exist");
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new UnauthorizedException("password incorrect");
		}
		//generate token
		const payload = {
			email: user.email,
			role: user.role,
			name: user.name,
		};
		const access_token = await this.jwtService.signAsync(payload);
		const refresh_token = await this.jwtService.signAsync(payload, {
			secret: jwtContants.refreshToken_secret,
			expiresIn: "300d",
		});
		await this._userService.update(user.id, { refreshToken: refresh_token });
		return { ...user, access_token, refresh_token };
	}
	async regiter(registerInfo: RegisterInfo) {
		const user = await this._userService.findByEmail(registerInfo.email);
		if (user) {
			throw new BadRequestException("account does exist");
		}
		//hash password
		const hashPassword = await bcrypt.hash(registerInfo.password, saltOrRounds);
		registerInfo.password = hashPassword;

		const saveUser = await this._userService.create(registerInfo);

		//send email confirm
		await this._mailService.sendUserConfirmation(registerInfo, "fy8efe");

		return saveUser;
	}
	async refresh(refresh_token: string) {
		try {
			const { email } = await this.jwtService.verifyAsync(refresh_token, {
				secret: jwtContants.refreshToken_secret,
			});

			const user = await this._userService.findByEmail(email);
			const payload = {
				email: user.email,
				role: user.role,
				name: user.name,
			};
			const access_token = await this.jwtService.signAsync(payload);
			return { ...payload, access_token };
		} catch (e) {
			throw new UnauthorizedException("Invalid token");
		}
	}
}
