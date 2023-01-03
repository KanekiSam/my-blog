import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findAdmin(username);
    if (user && user.userPassword === pass) {
      const { userPassword: pass, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
    const result = await this.usersService.findOne(user.username);
    if (!result) {
      return {};
    }
    const payload = { username: user.username, sub: result.userId };
    return {
      userName: result.userName,
      userId: result.userId,
      access_token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
