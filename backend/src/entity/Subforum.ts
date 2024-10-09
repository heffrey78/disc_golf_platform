import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import type { Category } from "./Category";
import type { Thread } from "./Thread";

@Entity()
export class Subforum {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne("Category", (category: Category) => category.subforums)
    category: Category;

    @OneToMany("Thread", (thread: Thread) => thread.subforum)
    threads: Thread[];
}