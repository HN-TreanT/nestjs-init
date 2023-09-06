import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";
export default class RegisterInfo {
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	@IsEmail()
	email: string;
	@IsNotEmpty()
	password: string;
}
