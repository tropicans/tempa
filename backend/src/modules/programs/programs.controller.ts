import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  async listPrograms(@CurrentUserDecorator() user: CurrentUser) {
    const items = await this.programsService.listPrograms(user);
    return { items };
  }

  @Post()
  async createProgram(@Body() body: Record<string, unknown>, @CurrentUserDecorator() user: CurrentUser) {
    return this.programsService.createProgram(body, user);
  }

  @Get(':programId')
  async getProgram(@Param('programId') programId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.programsService.getProgram(programId, user);
  }
}
