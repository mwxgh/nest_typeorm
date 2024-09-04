import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { AsyncRequestContextModule } from './async-context-request'
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    AsyncRequestContextModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    CategoryModule,
    TagModule,
  ],
})
export class ModulesModule {}
