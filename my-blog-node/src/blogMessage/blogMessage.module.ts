import { Module } from '@nestjs/common';
import { BlogMessageController } from './blogMessage.controller';
import { BlogMessageService } from './blogMessage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogMessage } from 'src/entities/BlogMessage.entity';
import { BlogMessageType } from 'src/entities/BlogMessageType.entity';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogMessage, BlogMessageType]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [BlogMessageService, JwtStrategy],
  controllers: [BlogMessageController],
})
export class BlogMessageModule {}
