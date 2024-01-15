import { JwtAuthGuard } from './jwt-auth.guard'
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class MyAccountGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
