import { Module } from '@nestjs/common';

import { ImplementationPlanningController } from './implementation-planning.controller';
import { ImplementationPlanningService } from './implementation-planning.service';

@Module({
  controllers: [ImplementationPlanningController],
  providers: [ImplementationPlanningService],
})
export class ImplementationPlanningModule {}
