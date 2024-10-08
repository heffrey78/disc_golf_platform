import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { Thread } from "./Thread";

@Entity()
export class Subforum {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Category, category => category.subforums)
    category: Category;

    @OneToMany(() => Thread, thread => thread.subforum)
    threads: Thread[];
}