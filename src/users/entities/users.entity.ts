import { BaseEntity } from "../../config/base.entity";
import { ROLES } from "../../constants/roles";
import { IUser } from "../../interfaces/user.interface";
import { Column, Entity, OneToMany } from "typeorm";
import { UsersProjectsEntity } from "./usersProjects.entity";

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity implements IUser {
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column()
    age: number;
    @Column({ unique: true })
    email: string;
    @Column({ unique: true })
    username: string;
    @Column()
    password: string;
    @Column({ type: 'enum', enum: ROLES })
    role: string;
    @OneToMany(() => UsersProjectsEntity, (usersProjects) => usersProjects.user)
    projectsIncludes: UsersProjectsEntity[];
}