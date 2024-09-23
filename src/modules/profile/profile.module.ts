import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { UserService } from '../user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ProfileController],
  providers: [UserService],
})
export class ProfileModule {}
