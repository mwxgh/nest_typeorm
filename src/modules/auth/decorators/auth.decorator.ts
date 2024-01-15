import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { RolesGuard } from '../guards/roles.guard'
import { ROLES } from '@/constants'
import { LocalAuthGuard } from '../guards/local-auth.guard'

export function Auth(...roles: number[]) {
  return applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(LocalAuthGuard, RolesGuard),
  )
}
