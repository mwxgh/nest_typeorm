import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC } from '@/constants'
import { UserLoggedException } from '@/exceptions'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    if (request.isAuthenticated()) {
      if (request.user.sessionId !== request.session.sessionId) {
        request.logout()
        throw new UserLoggedException()
      }

      return true
    }

    throw new UserLoggedException()
  }
}
