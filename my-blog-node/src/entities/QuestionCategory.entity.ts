import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionBankEntity } from './QuestionBank.entity';
import { QuestionRecordEntity } from './questionRecord.entity';

@Entity('question_category', { schema: 'blog' })
export class QuestionCategoryEntity {
  @PrimaryGeneratedColumn()
  @Column('int', { primary: true, name: 'category_id' })
  categoryId: number;

  @Column('varchar', { name: 'category_name', comment: '名称', length: 100 })
  categoryName: string;

  @Column('datetime', { name: 'create_time' })
  createTime: Date;

  @Column('varchar', { name: 'client_ip', comment: '来源ip', length: 100 })
  clientIp: string;

  @Column('varchar', { name: 'poster_url', comment: '封面图片', length: 1000 })
  posterUrl: string;

  @Column('varchar', {
    name: 'state',
    comment: '有效状态，1有效，2待审核',
    length: 100,
    default: () => "'2'",
  })
  state: string;

  @OneToMany(() => QuestionBankEntity, (questionBank) => questionBank.category)
  questionBanks: QuestionBankEntity[];

  @OneToMany(() => QuestionRecordEntity, (questionRecord) => questionRecord.category)
  questionRecords: QuestionRecordEntity[];
}
