import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	Req,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";

import { Paging } from "src/common/paging";
import { PagedData } from "src/models/PagedData";
import UserUpdate from "./dto/user-update";
import UserCreate from "./dto/user-create";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";
import UserReponse from "./dto/user-reponse";
import {
	CACHE_MANAGER,
	CacheInterceptor,
	CacheKey,
	CacheTTL,
} from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { HttpService } from "@nestjs/axios"
@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class UserController {
	constructor(
		private readonly userServices: UserService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly httpService:HttpService
		
		
	) {}
	@Get()
	// @Roles(ROLES.ADMIN, ROLES.USER)
	// @UseGuards(AuthGuard, RolesGuard)
	@UseInterceptors(CacheInterceptor)
	@CacheKey("users")
	@CacheTTL(3000)
	async getAll(
		@Query() paging: Paging,
		@Query("search") search: string,
		// @Query("search") search: string,
	): Promise<PagedData<User>> {
		try {
			return this.userServices.findAll(search, paging);
		} catch (err) {
			throw new BadRequestException("Server error");
		}
	}

	@Get("/:id")
	@UseInterceptors(CacheInterceptor)
	@CacheKey("user")
	@CacheTTL(10)
	async getDetail(@Param("id") id: number): Promise<UserReponse> {
		return this.userServices.getById(id);
	}
	@Get("/cache/demo-set-cache/:id")
	//  @UseInterceptors(CacheInterceptor)
	// // @CacheTTL(10)
	// @CacheKey("test") 
	async demoSetCache(@Param('id') id: any) {
		const data =await this.httpService.axiosRef.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
	    await this.cacheManager.set('test',data.data,600)
		return data.data;
	}

	@Get("/cache/demo-get-cache")
	// @UseInterceptors(CacheInterceptor)
	async demoGetCache() {
		const data = await this.cacheManager.get("test")
		return data; 
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
