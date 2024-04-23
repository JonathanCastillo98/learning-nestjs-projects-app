import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDTO, UserUpdateDTO, UsersProjectsDTO } from '../dto/user.dto';
import { ErrorManager } from '../../utils/error.maganer';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>,
        @InjectRepository(UsersProjectsEntity) private readonly userProjectRepository: Repository<UsersProjectsEntity>
    ) { }

    public async createUser(body: UserDTO): Promise<UsersEntity> {
        try {
            return await this.userRepository.save(body);
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async relationateEntities(body: UsersProjectsDTO): Promise<UsersProjectsEntity> {
        try {
            return await this.userProjectRepository.save(body);
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async findUsers(): Promise<UsersEntity[]> {
        try {
            const users: UsersEntity[] = await this.userRepository.find();
            if (users.length === 0) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se encontro resultado' });
            return users;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async findUser(id: string): Promise<UsersEntity> {
        try {
            const user: UsersEntity = await this.userRepository.createQueryBuilder('user').where({ id }).leftJoinAndSelect('user.projectsIncludes', 'projectsIncludes').leftJoinAndSelect('projectsIncludes.project', 'project').getOne();
            if (!user) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se encontro el usuario' });
            return user;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async updateUser(body: UserUpdateDTO, id: string): Promise<UpdateResult | undefined> {
        try {
            const user: UpdateResult = await this.userRepository.update(id, body);
            if (user.affected === 0) {
                throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se pudo actualizar' });
            }
            return user;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async deleteUser(id: string): Promise<DeleteResult | undefined> {
        try {
            const user: DeleteResult = await this.userRepository.delete(id);
            if (user.affected === 0) {
                throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se pudo borrar' });
            }
            return user;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }
}
