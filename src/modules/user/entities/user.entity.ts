import { Exclude } from 'class-transformer'
import { Column, Entity, Index, OneToMany } from 'typeorm'
import {
  EntityConstant,
  RoleEnum,
  UserLockedEnum,
  BaseStatusEnum,
} from '@/constants'
import { UserDto } from '@/modules/user/dto/user.dto'
import {
  AbstractEntityWithCU,
  IAbstractEntity,
} from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'
import { Content } from '@/modules/content/entities/content.entity'
import { Comment } from '@/modules/comment/entities/comment.entity'
import { Reaction } from '@/modules/reaction/entities/reaction.entity'

@Entity('users')
@UseDto(UserDto)
@Index(['email'], { unique: true })
export class User
  extends AbstractEntityWithCU<UserDto>
  implements IAbstractEntity<UserDto>
  {
  @Column({
    type: 'tinyint',
    unsigned: true,
  })
  role: RoleEnum

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  firstName: string

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  lastName: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
    unique: true,
  })
  username: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  @Exclude()
  password: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
    nullable: true,
  })
  email: string

  @Column({
    name: 'session_id',
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
    nullable: true,
  })
  sessionId: string

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
    nullable: true
  })
  refreshToken?: string | null

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: BaseStatusEnum.Active,
  })
  status: BaseStatusEnum

  @Column({
    name: 'is_locked',
    type: 'tinyint',
    unsigned: true,
    default: UserLockedEnum.Unlocked,
  })
  isLocked: UserLockedEnum

  @OneToMany(() => Content, (content) => content.createdBy)
  createdContents: Content[]

  @OneToMany(() => Content, (content) => content.releasedBy)
  releasedContents: Content[]

  @OneToMany(() => Comment, (comment) => comment.createdBy)
  createdComments: Comment[]

  @OneToMany(() => Comment, (comment) => comment.acceptor)
  acceptedComments: Comment[]

  @OneToMany(() => Reaction, (reaction) => reaction.reactor)
  reactions: Reaction[]
}
