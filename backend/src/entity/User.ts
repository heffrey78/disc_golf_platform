import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Thread } from "./Thread";
import { Post } from "./Post";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    password_hash!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ default: false })
    isAdmin!: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => Thread, thread => thread.author)
    threads!: Thread[];

    @OneToMany(() => Post, post => post.author)
    posts!: Post[];
}