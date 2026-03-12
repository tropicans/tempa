import { Body, Controller, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { ReflectionsService } from './reflections.service';

@Controller('projects/:projectId')
export class ReflectionsController {
  constructor(private readonly reflectionsService: ReflectionsService) {}

  @Post('reflections')
  async upsertReflection(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.reflectionsService.upsertReflection(projectId, body, user);
  }

  @Post('reflections/submit')
  async submitReflection(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.reflectionsService.submitReflection(projectId, user);
  }

  @Post('reflection-analysis:ai')
  async runReflectionAnalysis(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.reflectionsService.runReflectionAnalysis(projectId, user);
  }
}
