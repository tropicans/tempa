import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { AssessmentsService } from './assessments.service';

@Controller('projects/:projectId')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post('assessments')
  createAssessment(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.assessmentsService.createAssessment(projectId, body, user);
  }

  @Get('tai-score')
  getTaiScore(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.assessmentsService.getTaiScore(projectId, user);
  }

  @Post('tai-score')
  publishTaiScore(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.assessmentsService.publishTaiScore(projectId, user);
  }
}
