import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './commnet.service';
import { Comment } from 'src/entities/Comment.entity';
import { UserEntity } from 'src/entities/UserEntity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, UserEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
