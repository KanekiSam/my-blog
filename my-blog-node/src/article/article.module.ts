import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from 'src/entities/Article.entity';
import { ArticleLike } from 'src/entities/ArticleLike.entity';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleLike]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, JwtStrategy],
})
export class ArticleModule {}
