import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'entities/UserEntity';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import jscrypto from './jscrypto-util';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const args = context.getArgs();
    // const req = args[0];
    const request = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    // const data = context.switchToRpc().getData();
    // const { ADMIN } = req.headers;
    // console.log(req.headers);
    // const blackList = ['/article/save', '/article/delete'];
    // const target = blackList.find((item) => req.url.indexOf(item) > -1);
    // console.log(target);
    // if (target) {
    //   const [user, userPsd] = ADMIN ? ADMIN.split('/') : [];
    //   if (user === 'bigB' && userPsd === 'chihiro528') {
    //     return next.handle();
    //   }
    //   return next
    //     .handle()
    //     .pipe(
    //       catchError(() =>
    //         throwError(new BadGatewayException('你没有权限操作')),
    //       ),
    //     );
    // }
    // try {
    // const result = await this.repository.findOne({
    //   where: { userName: user, userPassword: userPsd, isAdmin: 1 },
    // });
    //   return next.handle();
    // } catch (err) {
    //   return next.handle();
    // }
    // console.log(data);
    // console.log(request);
    if (request.method === 'POST' && typeof request.body?.body === 'string') {
      const data = jscrypto.decrypt(request.body.body.replace(/\n/g, ''));
      request.body = data ? JSON.parse(data) : {};
    }
    const success = String(res.statusCode)[0] === '2';
    return next.handle().pipe(
      map((data) => {
        const _data =
          success && data ? jscrypto.encrypt(JSON.stringify(data)) : null;
        return {
          data: _data,
          status: res.statusCode,
          message: success ? '成功' : data.message || data,
        };
      }),
    );
    // .pipe(catchError((err) => throwError(new BadGatewayException())));
  }
}
