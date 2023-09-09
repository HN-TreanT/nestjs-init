import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
import { ROLES } from "src/constants/role.enum";
import { Post } from "../post/post.entity";
import { Field } from "mysql2";
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
	@Column({ nullable: true, default: null })
	refreshToken: string;
	@Column({ nullable: true, default: null })
	avartar: string;
	@OneToMany(() => Post, post => post.user)
	posts: Post[];
}
