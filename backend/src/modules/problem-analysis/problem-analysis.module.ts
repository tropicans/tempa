import { Module } from '@nestjs/common';

import { ProblemAnalysisController } from './problem-analysis.controller';
import { ProblemAnalysisService } from './problem-analysis.service';

@Module({
  controllers: [ProblemAnalysisController],
  providers: [ProblemAnalysisService],
})
export class ProblemAnalysisModule {}
