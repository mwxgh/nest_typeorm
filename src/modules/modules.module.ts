import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, UserModule, CategoryModule],
})
export class ModulesModule {}
