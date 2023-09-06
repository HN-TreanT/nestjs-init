import { isBoolean } from "class-validator";
export default class UserReponse {
	id: number;
	name: string;
	email: string;
	isActive: boolean;
	constructor(id: number, name: string, email: string, isActive: boolean) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.isActive = isActive;
	}
}
