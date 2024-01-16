import CSRF from '@fastify/csrf'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { CSRF_PROPERTY } from '@/constants'

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const secret = request.session.get(CSRF_PROPERTY)

    if (!secret) {
      return false
    }

    const tokens = new CSRF()

    return tokens.verify(secret, getToken(request), getUserInfo())

    function getToken(req: {
      body: { _csrf: any }
      headers: { [x: string]: any }
    }) {
      return (
        (req.body && req.body._csrf) ||
        req.headers['csrf-token'] ||
        req.headers['xsrf-token'] ||
        req.headers['x-csrf-token'] ||
        req.headers['x-xsrf-token']
      )
    }

    function getUserInfo() {
      // return undefined // got error Type 'undefined' is not assignable to type 'string'.
      return ''
    }
  }
}
