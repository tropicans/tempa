import { Body, Controller, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { CohortsService } from './cohorts.service';

@Controller('cohorts')
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @Post()
  createCohort(@Body() body: Record<string, unknown>, @CurrentUserDecorator() user: CurrentUser) {
    return this.cohortsService.createCohort(body, user);
  }

  @Post(':cohortId/enrollments')
  createEnrollment(
    @Param('cohortId') cohortId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.cohortsService.createEnrollment(cohortId, body, user);
  }

  @Post(':cohortId/mentor-assignments')
  createMentorAssignment(
    @Param('cohortId') cohortId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.cohortsService.createMentorAssignment(cohortId, body, user);
  }
}
