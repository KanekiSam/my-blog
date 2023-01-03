import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotSearchController } from './search.controller';
import { HotSearchService } from './search.service';
import { HotSearch } from 'src/entities/HotSearch.entity';

@Module({
  imports:[TypeOrmModule.forFeature([HotSearch])],
  controllers: [HotSearchController],
  providers: [HotSearchService],
  exports: [HotSearchService]
})
export class HotSearchModule {}
