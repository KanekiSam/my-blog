import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogMessageService } from './blogMessage.service';
import { Request as _Res } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('message')
@Controller('message')
export class BlogMessageController {
  constructor(private readonly BlogMessageService: BlogMessageService) {}

  getClientIp(req: _Res): string {
    let pass = req.headers['x-forwarded-for'];
    if (typeof pass === 'object') {
      pass = pass.join('|');
    }
    return (
      pass ||
      // req.connection.remoteAddress ||
      req.socket.remoteAddress
      // req.connection.socket.remoteAddress
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/msgCount')
  async msgCount() {
    return this.BlogMessageService.getMessageNum();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/getList')
  async getMsg(@Request() req) {
    return this.BlogMessageService.getMessage(req.query);
  }

  @Post('/save')
  async saveMsg(@Request() req) {
    await this.BlogMessageService.createMessage({
      ...req.body,
      clientIp: this.getClientIp(req),
    });
    return null;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/readMsg')
  async readMsg(@Request() req) {
    return this.BlogMessageService.readMessage(req.query.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/readAllMsg')
  async readAllMsg(@Request() req, @Res() res) {
    const result = await this.BlogMessageService.readAllMessage(req.query.id);
    if (!result) {
      res.status(HttpStatus.FORBIDDEN).json({
        message: '没有可以阅读的项',
        data: null,
        status: HttpStatus.FORBIDDEN,
      });
    }
    res
      .status(HttpStatus.OK)
      .json({ message: '操作成功', data: result, status: HttpStatus.OK });
  }
}
