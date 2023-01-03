import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import jscrypto from '../jscrypto-util';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'body',
      passwordField: 'body',
    });
  }

  async validate(payload): Promise<any> {
    const decode = jscrypto.decrypt(payload);
    const { username = '', password = '' } = decode ? JSON.parse(decode) : {};
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('账号密码错误，请重试');
    }
    return user;
  }
}
