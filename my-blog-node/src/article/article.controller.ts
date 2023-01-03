import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  HttpStatus,
  Header,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { Article } from 'src/entities/Article.entity';
import { ArticleService } from './article.service';
import { Response, Request } from 'express';
import { ArticleLike } from 'src/entities/ArticleLike.entity';
import { UserInterceptor } from 'src/user.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

export interface RequestParams {
  articleTypeId?: number;
  page?: number;
  size?: number;
}
@Controller('article')
export class ArticleController {
  constructor(private readonly ArticleService: ArticleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('save')
  async saveArticle(@Body() articleData: Article) {
    articleData.publishTime = new Date();
    console.log(articleData.content.length);
    return await this.ArticleService.saveOne(articleData);
  }
  /**文章搜索 */
  @Get('getList')
  async getArticle(@Req() request: Request) {
    if (!request.query.keyword) {
      return [];
    }
    const list = await this.ArticleService.findAll(request.query);

    return list;
  }

  @Get('getById')
  async getArticleById(@Req() request: Request) {
    return await this.ArticleService.findOne(request.query);
  }

  @Get('getListByPage')
  async getArticleByPage(@Req() request: Request) {
    const [list, total] = await this.ArticleService.findByPage(request.query);
    let arr = [];
    const clientIp = this.getClientIp(request);
    for (let item of list) {
      const data = await this.ArticleService.getLikeNum({
        articleId: item.articleId,
      });
      item.popularity = data;
      const result = item.articleLikes.find(
        (item) => item.clientIp === clientIp,
      );
      if (result) {
        item['like'] = true;
      }
      delete item.articleLikes;
      arr.push(item);
    }
    // res
    //   .status(HttpStatus.OK)
    //   .json({ data: { list, total }, message: '操作成功', status: 200 });
    return { list, total };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete')
  async deleteOne(@Req() request: Request) {
    return this.ArticleService.deleteOne(request.query);
  }

  @Get('getNear')
  async getPrevAndNext(@Req() request: Request, @Res() res: Response) {
    if (!request.query.id) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: HttpStatus.BAD_REQUEST, message: 'id不能为空' });
    }
    const data = await this.ArticleService.getNear({ id: request.query.id });
    res
      .status(HttpStatus.OK)
      .json({ data, message: '成功', status: HttpStatus.OK });
  }
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
  @Get('getLikeCount')
  async getLikeCount(@Req() request: Request, @Res() res: Response) {
    if (!request.query.articleId) {
      return '文章id不能为空';
    }
    const data = await this.ArticleService.getLikeNum({
      articleId: request.query.articleId,
    });
    return data;
  }

  @Post('saveLike')
  async saveLike(@Req() res: Request, @Body() data: ArticleLike) {
    data.clientIp = this.getClientIp(res);
    await this.ArticleService.giveLike(data);
    return { message: '成功' };
  }
  @Get('islike')
  async islike(@Req() request: Request) {
    if (!request.query.articleId) {
      // res.status(HttpStatus.BAD_REQUEST);
      return {
        message: '文章id不能为空',
        status: HttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    const clientIp = this.getClientIp(request);
    const data = await this.ArticleService.getLikeOrNot({
      clientIp,
      articleId: request.query.articleId,
    });
    // res.status(HttpStatus.OK).json(result);
    return data;
  }
  @Get('addSee')
  async addSeeCount(@Req() request: Request) {
    if (!request.query.articleId) {
      // res.status(HttpStatus.BAD_REQUEST);
      return { message: '文章id不能为空', status: HttpStatus.BAD_REQUEST };
    }
    // res.status(HttpStatus.OK).json({ message: '成功' });
    return await this.ArticleService.addSeeCount({
      articleId: request.query.articleId,
    });
  }
  @Get('getArticleCount')
  async getArticleCount() {
    return await this.ArticleService.getArticleStatics();
  }
}
