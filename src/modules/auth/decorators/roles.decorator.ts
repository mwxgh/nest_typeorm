import { ROLES } from '@/constants'
import { SetMetadata } from '@nestjs/common'

export const Roles = (...roles: string[]): any => SetMetadata(ROLES, roles)
