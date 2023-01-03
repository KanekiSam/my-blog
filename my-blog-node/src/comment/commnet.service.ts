import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/Comment.entity';
import { UserEntity } from 'entities/UserEntity';

@Injectable()
export class CommentService {
  // 使用InjectRepository装饰器并引入Repository这样就可以使用typeorm的操作了
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async saveOne(data: Comment) {
    const { userId } = data;
    if (userId) {
      const result = await this.userRepository.findOne(userId);
      if (result) {
        return await this.repository.save({
          ...data,
          userName: result.userName,
          userId: result.userId,
          userAvator: result.userAvator,
        });
      }
    }
    return await this.repository.save(data);
  }
  // 获取所有用户数据列表(userRepository.query()方法属于typeoram)
  async findAll({ articleId }): Promise<Comment[]> {
    return await this.repository.find({
      where: { articleId },
      select: [
        'commentContent',
        'parentId',
        'createTime',
        'commentId',
        'userName',
        'articleId',
        'userAvator',
      ],
    });
  }
  async getCommentStatics() {
    const [_, num] = await this.repository.findAndCount();
    return num;
  }
  async getNewComment(): Promise<Comment[]> {
    return await this.repository.find({
      select: [
        'commentContent',
        'createTime',
        'commentId',
        'userName',
        'articleId',
        'userAvator',
      ],
      take: 5,
      order: { createTime: 'DESC' },
    });
  }
}
