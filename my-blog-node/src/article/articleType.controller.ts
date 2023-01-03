import { Body, Controller, Get, Post } from '@nestjs/common';
import { ArticleType } from 'src/entities/ArticleType.entity';
import { ArticleTypeService } from './articleType.service';

@Controller('article')
export class ArticleTypeController {
  constructor(private readonly Service: ArticleTypeService) {}

  @Post('addType')
  async saveType(@Body() articleData: ArticleType) {
    return await this.Service.saveOne(articleData);
  }

  @Get('typeList')
  async getArticle() {
    return await this.Service.findAll();
  }
}
