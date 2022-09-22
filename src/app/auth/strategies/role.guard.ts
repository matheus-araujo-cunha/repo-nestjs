import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Observable, throwError } from 'rxjs';

import { config } from 'dotenv';

config();
@Injectable()
export class isAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    return user.isAdmin;
  }
}

@Injectable()
export class CreateAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { body, headers } = context.switchToHttp().getRequest();

    const token = headers.authorization?.split(' ')[1];

    if (!token && body.isAdmin) {
      return false;
    }

    let userDecoded: JwtPayload;

    verify(
      token as string,
      process.env.SECRET_KEY as string,
      (err, decoded: JwtPayload) => {
        if (err) {
          throw new UnauthorizedException(401, err as any);
        }

        userDecoded = decoded;
      },
    );

    if (!userDecoded.isAdmin && body.isAdmin) {
      return false;
    }

    return true;
  }
}
