import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ACCESS_LEVEL_KEY } from 'src/constants/key-decorators';
import { ROLES } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';


@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ) {
    const accessLevel = this.reflector.get<number>(
      ACCESS_LEVEL_KEY,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest<Request>();
    const { roleUser, idUser } = req;

    if (roleUser === ROLES.ADMIN || roleUser === ROLES.CREATOR) return true;

    const user = await this.userService.findUser(idUser);
    const userExistsInProject = user.projectsIncludes.find((project) => project.project.id === req.params.id);

    if (!userExistsInProject) throw new UnauthorizedException('No tienes acceso a este proyecto');
    if (accessLevel !== userExistsInProject.accessLevel) throw new UnauthorizedException('No tienes nivel de accesso para a este proyecto');
    return true;
  }
}
