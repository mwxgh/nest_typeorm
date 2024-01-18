import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { RolesGuard } from '../guards/roles.guard'
import { ROLES } from '@/constants'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

export const Auth = (...roles: number[]) =>
  applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  )
