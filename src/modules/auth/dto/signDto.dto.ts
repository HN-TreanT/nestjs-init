import { IsEmail, IsNotEmpty } from "class-validator";

export default class signInDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;
	@IsNotEmpty()
	password: string;
}
