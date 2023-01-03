import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  //   constructor(private readonly authService: AuthService) {
  //     super({
  //       usernameField: 'email',
  //       passwordField: 'password',
  //     });
  //   }
}
