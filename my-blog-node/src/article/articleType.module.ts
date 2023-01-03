import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleTypeController } from './articleType.controller';
import { ArticleTypeService } from './articleType.service';
import { ArticleType } from 'src/entities/ArticleType.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ArticleType])],
  controllers: [ArticleTypeController],
  providers: [ArticleTypeService],
})
export class ArticleTypeModule {}
