import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

import type { AbstractEntity, AbstractEntityWithCU } from '../base.entity'

export class AbstractDto {
  @Expose()
  @ApiProperty({ type: 'number' })
  id: number

  createdAt: Date

  @Exclude({ toClassOnly: true })
  updatedAt: Date

  @Exclude()
  deletedAt?: Date

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id
      this.createdAt = entity.createdAt
      this.updatedAt = entity.updatedAt
    }
  }
}

export class AbstractDtoWithCU extends AbstractDto {
  createdBy?: number

  updatedBy?: number

  constructor(
    entity: AbstractEntityWithCU,
    options?: { excludeFields?: boolean; excludeCUFields?: boolean },
  ) {
    super(entity, options)

    if (!options?.excludeCUFields) {
      this.createdBy = entity.createdBy
      this.updatedBy = entity.updatedBy
    }
  }
}
