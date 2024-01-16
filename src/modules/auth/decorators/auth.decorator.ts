import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { RolesGuard } from '../guards/roles.guard'
import { ROLES } from '@/constants'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

export function Auth(...roles: number[]) {
  return applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  )
}
