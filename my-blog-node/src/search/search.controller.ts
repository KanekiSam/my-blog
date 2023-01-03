import { Body, Controller, Get, Post } from '@nestjs/common';
import { HotSearchService } from './search.service';
import { HotSearch } from 'src/entities/HotSearch.entity';

@Controller('hotSearch')
export class HotSearchController {
  constructor(private readonly userService: HotSearchService) {}

  @Get('getTop')
  getHotTop(): Promise<HotSearch[]> {
    return this.userService.getHotTop();
  }
  @Post('addOne')
  async addOne(@Body() data: HotSearch) {
    await this.userService.saveOne(data);
    return { message: '成功' };
  }
}
