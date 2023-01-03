import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { ArticleTypeModule } from './article/articleType.module';
import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './auth/constants';
import { CommentModule } from './comment/comment.module';
import { QuestionBankModule } from './questionBank/questionBank.module';
import { HotSearchModule } from './search/search.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { UserService } from './user/user.service';
import { BlogMessageModule } from './blogMessage/blogMessage.module';

@Module({
  imports: [
    // 加载连接数据库
    TypeOrmModule.forRoot({
      type: 'mysql', // 数据库类型
      host: 'localhost', // 数据库ip地址
      port: 3306, // 端口
      username: 'root', // 登录名
      password: 'chihiro123', // 密码
      database: 'blog', // 数据库名称
      entities: [join(__dirname, '**', '*.entity.{ts,js}')], // 扫描本项目中.entity.ts或者.entity.js的文件
      synchronize: true, // 定义数据库表结构与实体类字段同步(这里一旦数据库少了字段就会自动加入,根据需要来使用)
    }),
    // 加载子模块
    UserModule,
    AuthModule,
    ArticleModule,
    ArticleTypeModule,
    CommentModule,
    HotSearchModule,
    QuestionBankModule,
    BlogMessageModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '12h' },
    // }),
  ],
  // providers: [UserService, LocalStrategy],
  // controllers: [AppController],
  // providers: [AppService, UserService],/
})
export class AppModule {}
