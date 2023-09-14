import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtContants } from "src/constants/jwtConstant";
import { MailModule } from "../mail/mail.module";
import { LocalStrategy } from "src/strategies/local.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtContants.secret,
      signOptions: { expiresIn: "60s" },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
