import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
  Request as Request1,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/entities/UserEntity.entity';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getList')
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }
  // @Post('saveOne')
  // saveOne(@Req() req) {
  //   return this.userService.saveOne(req);
  // }
  @Post('auth/register')
  async register(@Req() req: Request, @Res() res: Response) {
    const { body } = req;
    const result = await this.userService.checkNameValid(body.userName);
    if (!result) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: '这个名字已经被占用' });
      return;
    }
    const data = await this.userService.saveOne(body);
    res.status(HttpStatus.OK).json({ message: '注册成功' });
  }
  @Get('checkName')
  async checkName(@Req() req: Request, @Res() res: Response) {
    const { userName } = req.query;
    if (!res || typeof userName !== 'string') {
      res.status(HttpStatus.BAD_REQUEST).json({ message: '名称不能为空' });
      return;
    }
    const result = await this.userService.checkNameValid(userName);
    return res.status(HttpStatus.OK).json(result);
  }
}
