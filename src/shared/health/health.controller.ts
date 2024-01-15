import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { Public } from '../decorators'
import { ApiPublic } from '../decorators/http.decorator'

@ApiTags('Health check')
@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private ormIndicator: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  @Get()
  @Public()
  @ApiPublic()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.ormIndicator.pingCheck('database', { timeout: 1500 }),
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 300 * 1024 * 1024),
      () =>
        this.memoryHealthIndicator.checkRSS('memory_rss', 300 * 1024 * 1024),
    ])
  }
}
