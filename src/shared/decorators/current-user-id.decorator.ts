import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUserId = createParamDecorator(
  (_, ctx: ExecutionContext): unknown => {
    const req = ctx.switchToHttp().getRequest()

    return req.user?.id
  },
)
