import {
	Controller,
	Inject,
	Get,
	UseGuards,
	Post,
	Req,
	Body,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("cat")
export class CatController {
	constructor(
		@Inject("CAT_SERVICE") private readonly catService: ClientProxy,
	) {}
	@Get()
	// @UseGuards(AuthGuard)
	async getCat() {
		return this.catService.send(
			{
				cmd: "get-all-cat",
			},
			{},
		);
	}
	@Post()
	async createCat(@Req() req: any) {
		return this.catService.send(
			{
				cmd: "add-cat",
			},
			req.body,
		);
	}
	@Post("event")
	async createCatEvent(@Body() body: any) {
		this.catService.emit(
			{
				cmd: "add-cat",
			},
			body,
		);
		return true;
	}

	@Get("event")
	async getCatEvent() {
		this.catService.emit({ cmd: "get-all-cat" }, {});
		return true;
	}
}
