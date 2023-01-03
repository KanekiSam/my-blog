import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotSearch } from 'src/entities/HotSearch.entity';

@Injectable()
export class HotSearchService {
  // 使用InjectRepository装饰器并引入Repository这样就可以使用typeorm的操作了
  constructor(
    @InjectRepository(HotSearch)
    private readonly repository: Repository<HotSearch>,
  ) {}

  // 获取所有用户数据列表(userRepository.query()方法属于typeoram)
  async findAll(): Promise<HotSearch[]> {
    return await this.repository.find();
  }

  async getHotTop() {
    return await this.repository.find({
      order: { searchCount: 'DESC' },
      take: 5,
    });
  }

  async saveOne(data: HotSearch) {
    const res = await this.repository.findOne({
      where: { keyword: data.keyword },
    });
    if (res) {
      return await this.repository.save({
        id: res.id,
        keyword: data.keyword,
        searchCount: res.searchCount + 1,
      });
    }
    return await this.repository.save({
      keyword: data.keyword,
      searchCount: 1,
    });
  }
}
