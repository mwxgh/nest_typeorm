import { ROLES } from '@/constants'
import { SetMetadata } from '@nestjs/common'

export const Roles = (...roles: number[]) => SetMetadata(ROLES, roles)
