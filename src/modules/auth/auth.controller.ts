import {
	Controller,
	Post,
	Body,
	ClassSerializerInterceptor,
	UseInterceptors,
} from "@nestjs/common";
import signInDto from "./dto/signDto.dto";
import { AuthService } from "./auth.service";
import RegisterInfo from "./dto/regiter-info.dto";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { Public } from "src/decorators/public.decorator";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post("login")
	login(@Body() signDto: signInDto) {
		return this._authService.signIn(signDto.email, signDto.password);
	}

	@Post("register")
	register(@Body() registerInfo: RegisterInfo) {
		return this._authService.regiter(registerInfo);
	}
}
