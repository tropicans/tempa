import { Body, Controller, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { MonitoringService } from './monitoring.service';

@Controller('projects/:projectId')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Post('progress-logs')
  async createProgressLog(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.monitoringService.createProgressLog(projectId, body, user);
  }

  @Post('impact-metrics')
  async createImpactMetric(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.monitoringService.createImpactMetric(projectId, body, user);
  }
}
