import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async listProjects(@CurrentUserDecorator() user: CurrentUser) {
    const items = await this.projectsService.listProjects(user);
    return { items };
  }

  @Post()
  async createProject(@Body() body: Record<string, unknown>, @CurrentUserDecorator() user: CurrentUser) {
    return this.projectsService.createProject(body, user);
  }

  @Get(':projectId')
  async getProject(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.projectsService.getProject(projectId, user);
  }

  @Post(':projectId/artifacts')
  async createArtifact(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.projectsService.createArtifact(projectId, body, user);
  }
}
