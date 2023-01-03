import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionBankEntity } from 'src/entities/QuestionBank.entity';
import { QuestionCategoryEntity } from 'src/entities/QuestionCategory.entity';
import { QuestionCommentEntity } from 'src/entities/QuestionComment.entity';
import { QuestionRecordEntity } from 'src/entities/questionRecord.entity';
import { UserEntity } from 'src/entities/UserEntity.entity';
import { QuestionBankController } from './questionBank.controller';
import { QuestionBankService } from './questionBank.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionCommentEntity,
      QuestionCategoryEntity,
      QuestionBankEntity,
      QuestionRecordEntity,
      UserEntity
    ]),
  ],
  providers: [QuestionBankService],
  controllers: [QuestionBankController],
  exports: [QuestionBankService],
})
export class QuestionBankModule {}
