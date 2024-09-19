import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  CommentDto,
  CommentsPageOptionsDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto'
import AbstractService from '@/shared/services/abstract.service'
import { Comment } from './entities/comment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository, SelectQueryBuilder } from 'typeorm'
import { trim } from 'lodash'
import { CommentPriorityList, CommentStatusList, Direction } from '@/constants'
import { PageDto } from '@/shared/common/dto'

@Injectable()
export class CommentService extends AbstractService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super(commentRepository)
  }

  async customCreate({
    userId,
    body,
  }: {
    userId: number
    body: CreateCommentDto
  }): Promise<void> {
    if (body.parentId) {
      const [parentExists, isRoot] = await Promise.all([
        this.existsBy({ id: body.parentId }),
        this.existsBy({ id: body.parentId, parentId: IsNull() }),
      ])

      if (!parentExists)
        throw new BadRequestException('Parent comment does not exist.')
      if (!isRoot)
        throw new BadRequestException(
          'Parent comment is not a root-level comment.',
        )
    }

    await this.save({
      ...body,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  private buildQueryList(
    pageOptionsDto: CommentsPageOptionsDto,
  ): SelectQueryBuilder<Comment> {
    const { parentId, order, orderBy, q } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<Comment> =
      this.commentRepository.createQueryBuilder('comment')

    if (parentId) {
      queryBuilder.where({ parentId })
    }
    if (q) {
      queryBuilder.searchByString(trim(q), ['comment.detail'])
    }

    return queryBuilder.orderBy(
      `comment.${orderBy ?? 'createdAt'}`,
      order ?? Direction.ASC,
    )
  }

  async getList(optionsDto: CommentsPageOptionsDto): Promise<CommentDto[]> {
    const comments: Comment[] = await this.buildQueryList(optionsDto).getMany()

    return comments.toDtos()
  }

  async getWithPaginate(
    pageOptionsDto: CommentsPageOptionsDto,
  ): Promise<PageDto<CommentDto>> {
    const queryBuilder: SelectQueryBuilder<Comment> =
      this.buildQueryList(pageOptionsDto)

    const [comments, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return comments.toPageDto(pageMeta)
  }

  private buildFamilyTree(
    comments: Comment[],
    parentId: number | null = null,
  ): CommentDto[] {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => ({
        ...comment,
        status: CommentStatusList[comment.status],
        priority: CommentPriorityList[comment.priority],
        children: this.buildFamilyTree(comments, comment.id),
      }))
  }

  private async buildDescendants(rootId: number): Promise<Comment[]> {
    const data: Comment[] = await this.commentRepository.query(
      `
      WITH RECURSIVE comment_hierarchy AS (
          SELECT id,
              parent_id,
              content_id,
              detail,
              status,
              priority
          FROM comments
          WHERE id = ?
          UNION ALL
          SELECT c.id,
              c.parent_id,
              c.content_id,
              c.detail,
              c.status,
              c.priority
          FROM comments c
              INNER JOIN comment_hierarchy ch ON c.parent_id = ch.id
      )
      SELECT id,
          parent_id AS parentId,
          content_id AS contentId,
          detail,
          status,
          priority
      FROM comment_hierarchy
      `,
      [rootId],
    )

    return data
  }

  async findById(id: number): Promise<Comment> {
    const comment = await this.findOneBy({ id })

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} was not found.`)
    }

    return comment
  }

  async getById(id: number): Promise<CommentDto> {
    return (await this.findById(id)).toDto()
  }

  async getDescendants(rootId: number): Promise<CommentDto[]> {
    const data: Comment[] = await this.buildDescendants(rootId)

    return data.map((comment) => ({
      ...comment,
      status: CommentStatusList[comment.status],
      priority: CommentPriorityList[comment.priority],
    }))
  }

  async getFamilyTree(rootId: number): Promise<CommentDto[]> {
    const comments = await this.buildDescendants(rootId)
    return this.buildFamilyTree(comments)
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    console.log(updateCommentDto)
    return `This action updates a #${id} comment`
  }

  remove(id: number) {
    return `This action removes a #${id} comment`
  }
}
