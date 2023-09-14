import { Controller, Post, Body, ClassSerializerInterceptor, UseInterceptors, UseGuards, Req } from "@nestjs/common";
import signInDto from "./dto/signDto.dto";
import { AuthService } from "./auth.service";
import RegisterInfo from "./dto/regiter-info.dto";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { Public } from "src/decorators/public.decorator";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "src/guards/local.guard";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Req() req) {
    return this._authService.signIn(req.user);
  }

  @Post("register")
  register(@Body() registerInfo: RegisterInfo) {
    return this._authService.regiter(registerInfo);
  }
  @Post("refresh")
  refresh(@Body() req: any) {
    return this._authService.refresh(req.refresh_token);
  }
}
