import { Controller, Get } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { DashboardsService } from './dashboards.service';

@Controller('dashboard')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('participant')
  getParticipantDashboard(@CurrentUserDecorator() user: CurrentUser) {
    return this.dashboardsService.getParticipantDashboard(user);
  }

  @Get('mentor')
  getMentorDashboard(@CurrentUserDecorator() user: CurrentUser) {
    return this.dashboardsService.getMentorDashboard(user);
  }

  @Get('executive')
  getExecutiveDashboard(@CurrentUserDecorator() user: CurrentUser) {
    return this.dashboardsService.getExecutiveDashboard(user);
  }
}
