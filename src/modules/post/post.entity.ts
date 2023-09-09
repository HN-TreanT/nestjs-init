import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	name: string;
	@Column({ nullable: true, default: null })
	description: string;
	@ManyToOne(() => User, user => user.posts)
	user: User;
}
