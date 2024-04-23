import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UserDTO, UserUpdateDTO, UsersProjectsDTO } from '../dto/user.dto';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PublicAccess } from 'src/auth/decorators/public.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    public async registerUser(@Body() body: UserDTO) {
        return await this.usersService.createUser(body);
    }

    @Post('relationate-entities')
    public async relationateEntities(@Body() body: UsersProjectsDTO) {
        return await this.usersService.relationateEntities(body);
    }

    @Get('all')
    public async findAllUsers() {
        return await this.usersService.findUsers();
    }

    @Get(':id')
    public async findUserById(@Param('id') id: string) {
        return await this.usersService.findUser(id);
    }

    @Put('edit/:id')
    public async updateUser(@Body() body: UserUpdateDTO, @Param('id') id: string) {
        return await this.usersService.updateUser(body, id);
    }
    @Delete('delete/:id')
    public async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id);
    }
}
