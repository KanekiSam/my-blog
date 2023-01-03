import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/UserEntity.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { ADMIN } = context.switchToRpc().getData().headers;
    const blackList = ['/article/save', '/article/delete'];
    const target = blackList.find((item) => request.url.indexOf(item) > -1);
    return new Promise(async (r, j) => {
      if (target) {
        const [userName, userPassword] = ADMIN ? ADMIN.split('/') : [];
        const result = await this.repository.findOne({
          where: { userName, userPassword, isAdmin: 1 },
        });
        if (result) {
          r(true);
        } else {
          j();
        }
      } else {
        r(true);
      }
    });
  }
}
