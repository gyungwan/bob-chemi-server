import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class RestAuthAccessGuard extends AuthGuard('access') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}

export class RestAuthRefreshGuard extends AuthGuard('refresh') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
