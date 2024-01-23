/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { compact, map } from 'lodash'
import { Brackets, QueryBuilder, SelectQueryBuilder } from 'typeorm'
import { PaginationConstant } from './constants'
import { AbstractEntityWithCU } from './shared/common/base.entity'
import {
  AbstractDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from './shared/common/dto'

declare global {
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[]

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      options?: unknown,
    ): PageDto<Dto>
  }
}

declare module 'typeorm' {
  interface QueryBuilder<Entity> {
    searchByString(
      q: string,
      columnNames: string[],
      parameterName?: string,
    ): this
  }

  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      distinct?: boolean,
    ): Promise<[Entity[], PageMetaDto]>
  }
}

QueryBuilder.prototype.searchByString = function (
  q: string,
  columnNames: string[],
  parameterName = 'q',
) {
  if (!q) return this
  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} like :${parameterName}`)
      }
    }),
  )

  this.setParameter(parameterName, `%${q}%`)

  return this
}

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  distinct = false,
) {
  const page = pageOptionsDto.page || PaginationConstant.DefaultPage
  const count = pageOptionsDto.take || PaginationConstant.DefaultCount

  if (distinct) {
    this.take(count).skip((page - 1) * count)
  } else {
    this.limit(count).offset((page - 1) * count)
  }
  const [results, total] = await this.getManyAndCount()

  const pageMetaDto = new PageMetaDto({
    itemCount: total,
    pageOptionsDto,
  })

  return [results, pageMetaDto]
}

Array.prototype.toDtos = function <
  Entity extends AbstractEntityWithCU<Dto>,
  Dto extends AbstractDto,
>(options?: unknown): Dto[] {
  return compact(
    map<Entity, Dto>(this as Entity[], (item) => item.toDto(options as never)),
  )
}

Array.prototype.toPageDto = function (
  pageMetaDto: PageMetaDto,
  options?: unknown,
) {
  return new PageDto(this.toDtos(options), pageMetaDto)
}
