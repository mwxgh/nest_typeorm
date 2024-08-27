import { ConflictException, NotFoundException } from '@nestjs/common'
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  ObjectLiteral,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export abstract class AbstractService<TEntity extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<TEntity>) {}

  async find(options?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return this.repository.find(options)
  }

  async findOneBy(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ): Promise<TEntity | null> {
    return this.repository.findOneBy(where)
  }

  async findOne(options: FindOneOptions<TEntity>): Promise<TEntity | null> {
    return this.repository.findOne(options)
  }

  async findOneByOrFail(where: FindOptionsWhere<TEntity>): Promise<TEntity> {
    return await this.repository.findOneByOrFail(where)
  }

  async findOneOrFail(
    options: FindOneOptions<TEntity>,
  ): Promise<TEntity | null> {
    return this.repository.findOneOrFail(options)
  }

  async updateBy(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<TEntity>,
    partialEntity: QueryDeepPartialEntity<TEntity>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, partialEntity)
  }

  async save<T extends DeepPartial<TEntity>>(
    entities: T[] | T,
    options?: SaveOptions,
  ): Promise<T[]> {
    return this.repository.save(
      Array.isArray(entities) ? entities : [entities],
      options,
    )
  }

  createEntity(
    entityLike?: DeepPartial<TEntity> | DeepPartial<TEntity>[],
  ): TEntity | TEntity[] {
    return Array.isArray(entityLike)
      ? this.repository.create(entityLike)
      : entityLike
        ? this.repository.create(entityLike)
        : this.repository.create()
  }

  async exists(options?: FindManyOptions<TEntity>): Promise<boolean> {
    return this.repository.exists(options)
  }

  async existsBy(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ): Promise<boolean> {
    return this.repository.existsBy(where)
  }

  async validateDuplicate(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ): Promise<void> {
    if (await this.existsBy(where)) throw new ConflictException('Data existed')
  }

  async validateExist(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ): Promise<void> {
    if (!(await this.existsBy(where)))
      throw new NotFoundException('Data not exist')
  }

  async softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<TEntity>,
  ): Promise<UpdateResult> {
    return this.repository.softDelete(criteria)
  }
}

export default AbstractService
