import { InjectRepository } from "@nestjs/typeorm";
import { Paging } from "src/common/paging";
import { Repository, Document, Like, In } from "typeorm";

export class WebRepository<T extends Document> {
	private readonly _repository: Repository<T>;
	constructor(repository: Repository<T>) {
		this._repository = repository;
	}

	async getList(filter: any, paging: Paging): Promise<[T[], number]> {
		const data = await this._repository.findAndCount({
			where: { ...filter },
			skip: (paging.pageNumber - 1) * paging.pageSize,
			take: paging.pageSize,
		});
		//console.log(data);
		return data;
	}
	async create(req: any) {
		const data = this._repository.create(req);
		return await this._repository.save(data);
	}

	async update(id: number, data: any) {
		return await this._repository.update(id, data);
	}

	async findById(id: any) {
		return await this._repository.findOneBy({ id: id });
	}

	async deleteById(id: any) {
		return await this._repository.delete(id);
	}
	async deleteManyById(ids: number[]) {
		return await this._repository
			.createQueryBuilder()
			.delete()
			.from(this._repository.target)
			.where("id In (:ids)", {
				ids: ids,
			})
			.execute();
	}

	async deleteManyByCondition(filter: any) {
		const data = await this._repository.find({ where: { ...filter } });
		this._repository.remove(data);
		await this._repository.save(data);
		return true;
	}

	async updateManyByCondition(filter: any, update: any) {
		return await this._repository
			.createQueryBuilder()
			.update(this._repository.target)
			.set(update)
			.where(filter)
			.execute();
	}
	async CountAsync() {
		return await this._repository.count();
	}
}
