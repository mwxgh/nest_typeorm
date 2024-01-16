import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES } from '@/constants'
import { AuthDto } from '../dto'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: AuthDto = request.user

    return this.matchRoles(roles, user?.role)
  }

  private matchRoles(roles: number[], roleOfUser: number): boolean {
    return roles.includes(roleOfUser)
  }
}
