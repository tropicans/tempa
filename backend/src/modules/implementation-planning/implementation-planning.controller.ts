import { Body, Controller, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { ImplementationPlanningService } from './implementation-planning.service';

@Controller('projects/:projectId')
export class ImplementationPlanningController {
  constructor(private readonly implementationPlanningService: ImplementationPlanningService) {}

  @Post('implementation-plan')
  upsertImplementationPlan(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.implementationPlanningService.upsertImplementationPlan(projectId, body, user);
  }

  @Post('implementation-plan/submit')
  submitImplementationPlan(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.implementationPlanningService.submitImplementationPlan(projectId, user);
  }

  @Post('implementation-plan/review')
  reviewImplementationPlan(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.implementationPlanningService.reviewImplementationPlan(projectId, body, user);
  }
}
