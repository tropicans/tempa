import { Module } from '@nestjs/common';

import { DecisionDesignController } from './decision-design.controller';
import { DecisionDesignService } from './decision-design.service';

@Module({
  controllers: [DecisionDesignController],
  providers: [DecisionDesignService],
})
export class DecisionDesignModule {}
