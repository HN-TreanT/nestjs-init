import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ROLES } from "src/constants/role.enum";
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	@Exclude()
	password: string;

	@Column({ default: true })
	isActive: boolean;

	@Column({ default: ROLES.USER })
	role: ROLES;
	@Column()
	refreshToken: string;
	@Column({ nullable: true, default: null })
	avartar: string;
}
