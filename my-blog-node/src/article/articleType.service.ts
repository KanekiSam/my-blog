import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleType } from 'src/entities/ArticleType.entity';

@Injectable()
export class ArticleTypeService {
  // 使用InjectRepository装饰器并引入Repository这样就可以使用typeorm的操作了
  constructor(
    @InjectRepository(ArticleType)
    private readonly repository: Repository<ArticleType>,
  ) {}
  
  async saveOne(data: ArticleType) {
    return await this.repository.save(data);
  }
  // 获取所有用户数据列表(userRepository.query()方法属于typeoram)
  async findAll(): Promise<ArticleType[]> {
    return await this.repository.find();
  }

}
