import { IsInt, Max, Min } from "class-validator";
import { Transform } from "class-transformer";
export class Paging {
	@Transform(({ value }) => parseInt(value))
	pageSize: number = 100;

	@Transform(({ value }) => parseInt(value))
	pageNumber: number = 1;
}
