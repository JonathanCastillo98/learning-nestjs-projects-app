import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { ACCESS_LEVEL } from 'src/constants/roles';

@Controller('projects')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post('register')
    public async registerProject(@Body() body: ProjectDTO) {
        return await this.projectsService.createProject(body);
    }

    @Get('all')
    public async findProjects() {
        return await this.projectsService.findProjects();
    }

    @Get(':id')
    public async findProjectById(@Param('id') id: string) {
        return await this.projectsService.findProjectById(id);
    }

    @Put('edit/:id')
    public async updateProject(@Body() body: ProjectUpdateDTO, @Param('id') id: string) {
        return await this.projectsService.updateProject(body, id);
    }

    @Delete('delete/:id')
    public async deleteProject(@Param('id') id: string) {
        return await this.projectsService.deleteProject(id);
    }
}
