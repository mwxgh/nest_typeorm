import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles, RoleEnum } from '@/constants'
import { ApiAuth, ApiPageOkResponse, CurrentUserId } from '@/shared/decorators'
import { PageDto } from '@/shared/common/dto'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'
import {
  CategoriesPageOptionsDto,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto'

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Create new category' })
  create(
    @CurrentUserId() userId: number,
    @Body() body: CreateCategoryDto,
  ): Promise<void> {
    return this.categoryService.createCategory({ userId, body })
  }

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(PageDto<CategoryDto>, { summary: 'Find category with pagination' })
  @ApiPageOkResponse({
    description: 'Get category list',
    summary: 'Get category list',
    type: PageDto<CategoryDto>,
  })
  getAll(
    @Query() query: CategoriesPageOptionsDto,
  ): Promise<PageDto<CategoryDto>> {
    return this.categoryService.getCategoriesPaginate(query)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiAuth(CategoryDto, { summary: 'Find category by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<CategoryDto> {
    return this.categoryService.getCategoryById(id)
  }

  @Get('descendants/:id')
  @Auth(...AllRoles)
  @ApiAuth(CategoryDto, { summary: 'Find category by id' })
  getDescendants(
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<CategoryDto[]> {
    return this.categoryService.getCategoryDescendants(id)
  }

  @Get('family-tree/:id')
  @Auth(...AllRoles)
  @ApiAuth(CategoryDto, { summary: 'Find category by id' })
  getFamilyTree(
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<CategoryDto[]> {
    return this.categoryService.getCategoryTree(id)
  }

  @Put(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update category by id' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<void> {
    return this.categoryService.updateCategoryById({ id, userId, body })
  }

  @Delete(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Delete category by id' })
  delete(@Param('id', PositiveNumberPipe) id: number): Promise<void> {
    return this.categoryService.deleteCategoryById({ id })
  }
}
