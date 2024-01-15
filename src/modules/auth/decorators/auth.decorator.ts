import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { ROLES } from '@/constants'

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  )
}
