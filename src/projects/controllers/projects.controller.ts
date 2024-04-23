import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';

@Controller('projects')
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
