import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { CategoryRelationService } from './category-relation.service'
import { CategoryRelation } from './entities/category-relation.entity'
import { Content } from '../content/entities/content.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryRelation, Content])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRelationService],
  exports: [CategoryRelationService], // Ensure this is exported if needed in other modules
})
export class CategoryModule {}
