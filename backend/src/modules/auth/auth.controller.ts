import { Controller, Get } from '@nestjs/common';

import { CurrentUserDecorator } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/current-user';

@Controller('auth')
export class AuthController {
  @Get('me')
  getMe(@CurrentUserDecorator() user: CurrentUser) {
    return {
      user: { ...user, email: `${user.userId}@tempa.local`, roles: [user.role] },
    };
  }
}
