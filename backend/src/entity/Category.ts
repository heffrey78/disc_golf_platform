import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Subforum } from "./Subforum";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Subforum, subforum => subforum.category)
    subforums: Subforum[];
}