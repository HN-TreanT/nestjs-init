import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";

import { Paging } from "src/common/paging";
import { PagedData } from "src/models/PagedData";
import UserUpdate from "./dto/user-update";
import UserCreate from "./dto/user-create";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { AuthGuard } from "src/guards/auth.guard";
import { Public } from "src/decorators/public.decorator";
import { Roles } from "src/decorators/role.decorator";
import { ROLES } from "src/constants/role.enum";
import { RolesGuard } from "src/guards/role.guard";
import { FileInterceptor } from "@nestjs/platform-express";
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class UserController {
	constructor(private readonly userServices: UserService) {}
	@Get()
	// @Roles(ROLES.ADMIN, ROLES.USER)
	// @UseGuards(AuthGuard, RolesGuard)
	async getAll(
		@Query("paging") paging: Paging,
		@Query("search") search: string,
	): Promise<PagedData<User>> {
		try {
			return this.userServices.findAll(search, paging);
		} catch (err) {
			throw new BadRequestException("Server error");
		}
	}

	@Post()
	// @UseGuards(AuthGuard)
	create(@Body() req: UserCreate) {
		return this.userServices.create(req);
	}
	@Put("/:id")
	// @UseGuards(AuthGuard)
	async update(@Param("id", ParseIntPipe) id: number, @Body() req: UserUpdate) {
		return this.userServices.update(id, req);
	}
	@Post("upload-avartar")
	// @UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor("avartar"))
	async uploadAvartar(
		@Req() req: any,
		@UploadedFile() file: Express.Multer.File,
	) {
		console.log(req.body);
		console.log("upload file");
		console.log(file);
	}

	@Delete("/:id")
	// @UseGuards(AuthGuard)
	async deleteById(@Param("id", ParseIntPipe) id: number) {
		await this.userServices.delete(id);
		return true;
	}
}
