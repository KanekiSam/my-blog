import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/UserEntity.entity';

@Injectable()
export class UserService {
  // 使用InjectRepository装饰器并引入Repository这样就可以使用typeorm的操作了
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async checkNameValid(userName: string) {
    const data = await this.userRepository.find({
      where: { userName },
    });
    if (data.length) {
      return false;
    }
    return true;
  }
  async saveOne(user: UserEntity) {
    return await this.userRepository.save({
      userName: user.userName,
      userId: user.userId,
      userPassword: user.userPassword,
      userSex: user.userSex,
      userBirthday: user.userBirthday,
      userEmail: user.userEmail,
      userQq: user.userQq,
      question: user.question,
      answer: user.answer,
      userAvator: user.userAvator,
      createTime: new Date(),
    });
  }
  // 获取所有用户数据列表(userRepository.query()方法属于typeoram)
  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  findOne(userName: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { userName } });
  }

  findAdmin(userName: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { userName, isAdmin: 1 } });
  }
}
