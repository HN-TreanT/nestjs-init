import { IsArray, IsBoolean, IsInt } from "class-validator";
export class PagedData<T> {
	@IsInt()
	readonly CurrentPage: number;
	@IsInt()
	readonly TotalPage: number;
	@IsBoolean()
	readonly CanNext: boolean;
	@IsBoolean()
	readonly CanBack: boolean;
	@IsArray()
	readonly data: T[];
	constructor(CurrentPage: number, TotalPage: number, data: T[]) {
		this.CurrentPage = CurrentPage;
		this.TotalPage = TotalPage;
		this.CanNext = this.CurrentPage < this.TotalPage;
		this.CanBack = this.CurrentPage > 1;
		this.data = data;
	}
}
