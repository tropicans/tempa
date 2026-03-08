import { Body, Controller, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { ProblemAnalysisService } from './problem-analysis.service';

@Controller('projects/:projectId')
export class ProblemAnalysisController {
  constructor(private readonly problemAnalysisService: ProblemAnalysisService) {}

  @Post('problem-statement')
  upsertProblemStatement(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.problemAnalysisService.upsertProblemStatement(projectId, body, user);
  }

  @Post('problem-statement/submit')
  submitProblemStatement(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.problemAnalysisService.submitProblemStatement(projectId, user);
  }

  @Post('problem-analysis:ai')
  runProblemAnalysis(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.problemAnalysisService.runProblemAnalysis(projectId, user);
  }

  @Post('problem-statement/review')
  reviewProblemStatement(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.problemAnalysisService.reviewProblemStatement(projectId, body, user);
  }
}
