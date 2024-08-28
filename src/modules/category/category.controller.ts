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
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles, RoleEnum } from '@/constants'
import { ApiAuth, ApiPageOkResponse, CurrentUserId } from '@/shared/decorators'
import { PageDto } from '@/shared/common/dto'
import { CategoryDto } from './dto/category.dto'
import { CategoriesPageOptionsDto } from './dto/categories-page-options.dto'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Create new category' })
  async create(
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
  getAllWithMeta(
    @Query() query: CategoriesPageOptionsDto,
  ): Promise<PageDto<CategoryDto>> {
    return this.categoryService.getCategoriesPaginate(query)
  }

  @Get('/child')
  @Auth(...AllRoles)
  @ApiAuth(CategoryDto, {
    summary: 'Find category relative with parent category',
  })
  @ApiPageOkResponse({
    description: 'Get child categories list',
    summary: 'Get child categories list',
    type: CategoryDto,
  })
  getAll(@Query() query: CategoriesPageOptionsDto): Promise<CategoryDto[]> {
    return this.categoryService.getCategories(query)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiAuth(CategoryDto, { summary: 'Find category by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<CategoryDto> {
    return this.categoryService.getCategoryById(id)
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
