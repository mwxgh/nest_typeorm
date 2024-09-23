import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import {
  FindOptionsWhere,
  MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'
import {
  AppConstant,
  Direction,
  UserLockedEnum,
  BaseStatusEnum,
} from '@/constants'
import { AbstractService } from '@/shared/services/abstract.service'
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UsersPageOptionsDto,
} from './dto'
import { PageDto } from '@/shared/common/dto'
import { trim } from 'lodash'
import { UserProp } from '@/shared/interfaces'
import { ChangePasswordDto, UpdateProfileDto } from '../profile/dto'

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository)
  }

  async customCreate({
    userProp,
    body,
  }: {
    userProp: UserProp
    body: CreateUserDto
  }) {
    await this.validateDuplicate({ username: body.username })

    const { id: userId, role } = userProp
    const { role: newUserRole } = body

    if (role < newUserRole) {
      throw new BadRequestException(
        'Cannot create user with a higher role level',
      )
    }

    await this.save({
      ...body,
      password: this.hashPassword(AppConstant.defaultPassword),
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async findActive(conditions: FindOptionsWhere<User>): Promise<User | null> {
    return await this.findOneBy({
      ...conditions,
      isLocked: UserLockedEnum.Unlocked,
      status: BaseStatusEnum.Active,
    })
  }

  async findBy({ id, role }: { id?: number; role?: number }): Promise<User> {
    const user = await this.findOneBy({
      id,
      ...(role !== undefined && { role: MoreThanOrEqual(role) }),
    })

    if (!user) throw new NotFoundException(`User with ID ${id} was not found.`)

    return user
  }

  private buildQueryList(
    pageOptionsDto: UsersPageOptionsDto,
    userProp: UserProp,
  ): SelectQueryBuilder<User> {
    const { role, email, order, orderBy, q } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<User> = this.userRepository
      .createQueryBuilder('user')
      .andWhere('user.role >= :role', { role: userProp.role })

    if (role) queryBuilder.andWhere({ role })
    if (email) queryBuilder.andWhere({ email })
    if (q) {
      queryBuilder.searchByString(trim(q), ['user.firstName', 'user.lastName'])
    }

    return queryBuilder.orderBy(
      `user.${orderBy ?? 'createdAt'}`,
      order ?? Direction.ASC,
    )
  }

  async getWithPaginate(
    pageOptionsDto: UsersPageOptionsDto,
    userProp: UserProp,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder: SelectQueryBuilder<User> = this.buildQueryList(
      pageOptionsDto,
      userProp,
    )

    const [users, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return users.toPageDto(pageMeta)
  }

  async getById({
    id,
    userProp,
  }: {
    id: number
    userProp: UserProp
  }): Promise<UserDto> {
    return (await this.findBy({ id, role: userProp.role })).toDto()
  }

  async customUpdate({
    id,
    userProp,
    body,
  }: {
    id: number
    userProp: UserProp
    body: UpdateUserDto
  }): Promise<void> {
    const user = await this.findBy({ id, role: userProp.role })

    await this.updateBy(user.id, { ...body, updatedBy: userProp.id })
  }

  async deleteBy({
    id,
    userProp,
  }: {
    id: number
    userProp: UserProp
  }): Promise<void> {
    if (id === userProp.id) {
      throw new BadRequestException('Cannot delete yourself')
    }
    const user = await this.findBy({ id, role: userProp.role })

    await this.softDelete(user.id)
  }

  async getProfile({ id }: { id: number }): Promise<Partial<UserDto>> {
    const profile = await this.findBy({ id })
    return UserDto.toSimplifiedProfileDto(profile)
  }

  async updateProfile({
    id,
    body,
  }: {
    id: number
    body: UpdateProfileDto
  }): Promise<void> {
    const user = await this.findBy({ id })

    await this.updateBy(user.id, { ...body, updatedBy: id })
  }

  async changePassword({
    id,
    body,
  }: {
    id: number
    body: ChangePasswordDto
  }): Promise<void> {
    const { currentPassword, newPassword } = body

    const user = await this.findBy({ id })

    if (this.hashPassword(currentPassword) !== user.password) {
      throw new BadRequestException('Current password incorrect')
    }

    await this.updateBy(user.id, {
      password: this.hashPassword(newPassword),
      updatedBy: id,
    })
  }

  async deleteProfile({ id }: { id: number }): Promise<void> {
    const user = await this.findBy({ id })

    await this.softDelete(user.id)
  }
}
