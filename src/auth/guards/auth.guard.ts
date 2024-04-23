import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY } from 'src/constants/key-decorators';
import { UsersService } from 'src/users/services/users.service';
import { useToken } from 'src/utils/use.token';
import { IUseToken } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector
  ) { }
  async canActivate(
    context: ExecutionContext,
  ) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler()
    )

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    if (!req.headers["authorization"]) throw new UnauthorizedException('No authorization header');
    if (!req.headers["authorization"].startsWith("Bearer")) throw new UnauthorizedException('No Bearer schema');

    const splittedToken = req.headers["authorization"].split("Bearer ");

    if (splittedToken.length !== 2) throw new UnauthorizedException('Invalid Token');

    const token = splittedToken[1];
    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string') throw new UnauthorizedException(manageToken);
    if (manageToken.isExpired) throw new UnauthorizedException('Token expired');

    const { sub } = manageToken;
    const user = await this.userService.findUser(sub);

    if (!user) throw new UnauthorizedException('Invalid user');

    req.idUser = user.id;
    req.roleUser = user.role;

    return true;
  }
}
