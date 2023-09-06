import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { jwtContants } from "src/constants/jwtConstant";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const [type, token] = request.headers.authorization?.split(" ") ?? [];

		if (!token) {
			throw new UnauthorizedException("token invalid");
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: jwtContants.secret,
			});
			request["user"] = payload;
		} catch (err) {
			throw new UnauthorizedException("token invalid");
		}

		return true;
	}
}
