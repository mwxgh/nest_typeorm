import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserProp } from '../interfaces'

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserProp | null => {
    const req = ctx.switchToHttp().getRequest()

    return req.user ? { id: req.user.id, role: req.user.role } : null
  },
)
