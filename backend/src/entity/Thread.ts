import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Subforum } from "./Subforum";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Thread {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Subforum, subforum => subforum.threads)
    subforum: Subforum;

    @ManyToOne(() => User, user => user.threads)
    author: User;

    @OneToMany(() => Post, post => post.thread)
    posts: Post[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}