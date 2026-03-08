import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  log(actionType: string, targetType: string, targetId: string) {
    this.logger.log(`${actionType} ${targetType} ${targetId}`);
  }
}
