import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionCategoryEntity } from './QuestionCategory.entity';

@Index('question_record_FK', ['categoryId'], {})
@Entity('question_record', { schema: 'blog' })
export class QuestionRecordEntity {
  @PrimaryGeneratedColumn()
  @Column('int', { primary: true, name: 'record_id' })
  recordId: number;

  @Column('varchar', { name: 'client_ip', length: 100 })
  clientIp: string;

  @Column('int', { name: 'category_id' })
  categoryId: number;

  @Column('int', {
    name: 'accuracy_rate',
    comment: '平均答题准确率',
  })
  accuracyRate: number;

  @Column('int', { name: 'frequency', comment: '答题次数' })
  frequency: number;

  @Column('datetime', { name: 'create_time' })
  createTime: Date;

  @ManyToOne(
    () => QuestionCategoryEntity,
    (questionCategory) => questionCategory.questionRecords,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'categoryId' }])
  category: QuestionCategoryEntity;
}
