import * as fastifyMultipart from '@fastify/multipart'
import {
  ClassSerializerInterceptor,
  HttpStatus,
  RequestMethod,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { AppConstant } from '@constants/app.constant'
import { setupSwagger } from './shared/utils/setup.swagger'
import config from '@/config/config'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ maxParamLength: AppConstant.maxParamLength }),
  )
  app.register(fastifyMultipart)

  // Get config of app.
  const appConfig = config().app

  // Enable CORS
  app.enableCors({
    origin:
      appConfig.env === AppConstant.serverDev
        ? [appConfig.url, 'https://localhost:3000']
        : (appConfig.url as any),
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: [
      'Content-Type',
      'csrf-token',
      'xsrf-token',
      'x-csrf-token',
      'x-xsrf-token',
    ],
    credentials: true,
  })

  // Set global prefix for app.
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  })

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  )

  // Use global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  )

  // Setup swagger
  setupSwagger(app)

  // Run app with port
  await app.listen(appConfig.port, '0.0.0.0')
}
bootstrap()
