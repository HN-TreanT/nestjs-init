import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
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
import { FileInterceptor } from "@nestjs/platform-express";
import UserReponse from "./dto/user-reponse";
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { HttpService } from "@nestjs/axios";
import { ROLES } from "src/constants/role.enum";
import { Roles } from "src/decorators/role.decorator";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { diskStorage } from "multer";
import { multerOptions } from "src/helper/MullterConfig";
import { v4 as uuid } from "uuid";

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(
    private readonly userServices: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService
  ) {}

  ///get all
  @Get()
  @Roles(ROLES.ADMIN, ROLES.USER)
  @UseGuards(AuthGuard, RolesGuard)
  // @UseInterceptors(CacheInterceptor)
  // @CacheKey("users")
  // @CacheTTL(3000)
  async getAll(@Query() paging: Paging, @Query("search") search: string): Promise<PagedData<User>> {
    try {
      const users = await this.cacheManager.get("users");
      if (!users || users["page"] !== paging.pageNumber) {
        const users = await this.userServices.findAll(search, paging);
        await this.cacheManager.set("users", { page: paging.pageNumber, data: users });
        return users;
      }
      return users["data"];
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  ///get by id
  @CacheKey("user")
  @UseInterceptors(CacheInterceptor)
  @Get("/:id")
  async getDetail(@Param("id") id: number): Promise<UserReponse> {
    return this.userServices.getById(id);
  }

  //// demo set cache
  // @CacheTTL(20)
  // @CacheKey("test")
  @Get("/cache/demo-set-cache/:id")
  // @UseInterceptors(CacheInterceptor)
  async demoSetCache(@Param("id") id: any) {
    const data = await this.httpService.axiosRef.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    await this.cacheManager.set("test", data.data);
    return data.data;
  }

  //demo get cache
  @Get("/cache/demo-get-cache")
  // @UseInterceptors(CacheInterceptor)
  async demoGetCache() {
    const data = await this.cacheManager.get("test");
    return data;
  }

  //create
  @Post()
  // @UseGuards(AuthGuard)
  create(@Body() req: UserCreate) {
    return this.userServices.create(req);
  }

  //edit
  @Put("/:id")
  // @UseGuards(AuthGuard)
  async update(@Param("id", ParseIntPipe) id: number, @Body() req: UserUpdate) {
    return this.userServices.update(id, req);
  }

  //upload avartar
  @Post("upload-avartar")
  // @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("avartar", multerOptions))
  async uploadAvartar(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: "image/png" })],
      })
    )
    file: Express.Multer.File
  ) {
    console.log(req.body);
    console.log("upload file");
    console.log(file);
  }

  //delete user
  @Delete("/:id")
  // @UseGuards(AuthGuard)
  async deleteById(@Param("id", ParseIntPipe) id: number) {
    await this.userServices.delete(id);
    return true;
  }
}
