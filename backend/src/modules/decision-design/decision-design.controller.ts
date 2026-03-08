import { Body, Controller, Param, Post } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';
import { DecisionDesignService } from './decision-design.service';

@Controller('projects/:projectId')
export class DecisionDesignController {
  constructor(private readonly decisionDesignService: DecisionDesignService) {}

  @Post('decision-options:ai')
  generateDecisionOptions(@Param('projectId') projectId: string, @CurrentUserDecorator() user: CurrentUser) {
    return { items: this.decisionDesignService.generateDecisionOptions(projectId, user) };
  }

  @Post('decision-options/:decisionOptionId/select')
  selectDecisionOption(
    @Param('projectId') projectId: string,
    @Param('decisionOptionId') decisionOptionId: string,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.decisionDesignService.selectDecisionOption(projectId, decisionOptionId, user);
  }

  @Post('decision-options/review')
  reviewDecisionPackage(
    @Param('projectId') projectId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUserDecorator() user: CurrentUser,
  ) {
    return this.decisionDesignService.reviewDecisionPackage(projectId, body, user);
  }
}
