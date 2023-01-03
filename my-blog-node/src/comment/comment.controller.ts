import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ArticleType } from 'src/entities/ArticleType.entity';
import { Comment } from 'src/entities/Comment.entity';
import { CommentService } from './commnet.service';
import { Request, Response } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly Service: CommentService) {}

  getClientIp(req: Request): string {
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
  @Post('addComment')
  async saveOne(@Body() data: Comment, @Req() req: Request) {
    data.clientIp = this.getClientIp(req);
    data.createTime = new Date();
    return await this.Service.saveOne(data);
  }

  @Get('commentList')
  async getArticle(@Req() req: Request) {
    if (!req.query.articleId) {
      // res.status(HttpStatus.BAD_REQUEST).json({ message: '文章查找错误' });
      return { message: '文章查找错误' };
    }
    const data = await this.Service.findAll({ articleId: req.query.articleId });
    return data;
  }

  @Get('commentCount')
  async getCommentCOunt() {
    return await this.Service.getCommentStatics();
  }

  @Get('getNewComment')
  async getNewComment() {
    return await this.Service.getNewComment();
  }
}
