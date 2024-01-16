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

  save<T extends DeepPartial<TEntity>>(
    entities: T[] | T,
    options?: SaveOptions,
  ): Promise<T[]> {
    return this.repository.save(
      Array.isArray(entities) ? entities : [entities],
      options,
    )
  }

  create(entityLike: DeepPartial<TEntity>): TEntity {
    return this.repository.create(entityLike)
  }
}

export default AbstractService
