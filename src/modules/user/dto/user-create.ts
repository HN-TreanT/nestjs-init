import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";
export default class UserCreate {
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	@IsEmail()
	email: string;
	@IsNotEmpty()
	password: string;
}
