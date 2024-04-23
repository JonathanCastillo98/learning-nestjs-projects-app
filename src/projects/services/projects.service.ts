import { Injectable } from '@nestjs/common';
import { ProjectsEntity } from '../entities/projects.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorManager } from 'src/utils/error.maganer';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(ProjectsEntity) 
        private readonly projectRepository: Repository<ProjectsEntity>,
        @InjectRepository(UsersProjectsEntity) 
        private readonly usersProjectsRepository: Repository<UsersProjectsEntity>,
        private readonly usersService: UsersService,
    ) { }

    public async createProject(body: ProjectDTO, userId: string): Promise<ProjectsEntity> {
        try {
            const user = await this.usersService.findUser(userId);
            const project = await this.projectRepository.save(body);
            await this.usersProjectsRepository.save({
                accessLevel: ACCESS_LEVEL.OWNER,
                user,
                project,
            })
            return project;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async findProjects(): Promise<ProjectsEntity[]> {
        try {
            const projects: ProjectsEntity[] = await this.projectRepository.find();
            if (projects.length === 0) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se encontro resultado' });
            return projects;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async findProjectById(id: string): Promise<ProjectsEntity> {
        try {
            const project: ProjectsEntity = await this.projectRepository.createQueryBuilder('project').where({ id }).leftJoinAndSelect('project.usersIncludes', 'usersIncludes').leftJoinAndSelect('usersIncludes.user', 'user').getOne();
            if (!project) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se encontro resultado' });
            return project;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async updateProject(body: ProjectUpdateDTO, id: string): Promise<UpdateResult | undefined> {
        try {
            const project: UpdateResult = await this.projectRepository.update(id, body);
            if (project.affected === 0) {
                throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se pudo actualizar' });
            }
            return project;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async deleteProject(id: string): Promise<DeleteResult | undefined> {
        try {
            const project: DeleteResult = await this.projectRepository.delete(id);
            if (project.affected === 0) {
                throw new ErrorManager({ type: 'BAD_REQUEST', message: 'No se pudo borrar' });
            }
            return project;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }
}
