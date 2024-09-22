import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { AsyncRequestContextModule } from './async-context-request'
import { TagModule } from './tag/tag.module';
import { MediaModule } from './media/media.module';
import { ContentModule } from './content/content.module';
import { CommentModule } from './comment/comment.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [
    AsyncRequestContextModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    CategoryModule,
    TagModule,
    MediaModule,
    ContentModule,
    CommentModule,
    MinioModule,
  ],
})
export class ModulesModule {}
