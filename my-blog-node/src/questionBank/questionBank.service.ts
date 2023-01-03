import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/UserEntity.entity';
import { QuestionBankEntity } from 'src/entities/QuestionBank.entity';
import { QuestionCategoryEntity } from 'src/entities/QuestionCategory.entity';
import { QuestionCommentEntity } from 'src/entities/QuestionComment.entity';
import { QuestionRecordEntity } from 'src/entities/questionRecord.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectRepository(QuestionBankEntity)
    private readonly bankReponsitory: Repository<QuestionBankEntity>,
    @InjectRepository(QuestionCategoryEntity)
    private readonly categReponsitory: Repository<QuestionCategoryEntity>,
    @InjectRepository(QuestionCommentEntity)
    private readonly commentReponsitory: Repository<QuestionCommentEntity>,
    @InjectRepository(QuestionRecordEntity)
    private readonly recordResponsity: Repository<QuestionRecordEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**获取某类别全部题目 */
  async queryBankList(categoryId) {
    return await this.bankReponsitory.find({
      where: { state: '1', categoryId },
      order: { createTime: 'DESC' },
      relations: ['questionComments', 'category'],
    });
  }

  /**获取全部类目 */
  async queryCategory() {
    return await this.categReponsitory.find({
      where: { state: '1' },
      order: { createTime: 'DESC' },
      relations: ['questionBanks', 'questionRecords'],
    });
  }

  /**获取题目 */
  async queryQuestion(id) {
    return await this.bankReponsitory.findOne(id, {
      relations: ['questionComments', 'category'],
    });
  }

  /**新增题目 */
  async addQuestion(data: QuestionBankEntity) {
    delete data.questionId;
    data.createTime = new Date();
    data.state = '1';
    return await this.bankReponsitory.save(data);
  }

  /**删除题目 */
  async deleteQuestion(id) {
    return await this.bankReponsitory.save({
      questionId: id,
      state: '3',
    });
  }

  /**新增题目类别 */
  async addCategory(data: QuestionCategoryEntity) {
    delete data.categoryId;
    data.createTime = new Date();
    data.state = '1';
    return await this.categReponsitory.save(data);
  }

  /**新增题目评论 */
  async addComments(data: QuestionCommentEntity) {
    delete data.commentId;
    data.createTime = new Date();
    if (data.userId) {
      const result = await this.userRepository.findOne(data.userId);
      if (result) {
        return await this.commentReponsitory.save({
          ...data,
          userName: result.userName,
          userId: result.userId,
          userAvator: result.userAvator,
        });
      }
    }
    return await this.commentReponsitory.save(data);
  }

  /**新增答题记录 */
  async addRecord(data: QuestionRecordEntity) {
    const res = await this.recordResponsity.findOne({
      where: { clientIp: data.clientIp, categoryId: data.categoryId },
    });
    if (res && res.accuracyRate) {
      const rate = (res.accuracyRate + data.accuracyRate) / 2;
      await this.recordResponsity.save({
        recordId: res.recordId,
        accuracyRate: rate,
        frequency: res.frequency + 1,
      });
    } else {
      data.createTime = new Date();
      return await this.recordResponsity.save({ ...data, frequency: 1 });
    }
  }
}
