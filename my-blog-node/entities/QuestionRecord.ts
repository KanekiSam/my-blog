import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { QuestionCategory } from "./QuestionCategory";

@Index("question_record_FK", ["categoryId"], {})
@Entity("question_record", { schema: "blog" })
export class QuestionRecord {
  @Column("varchar", { name: "client_ip", length: 100 })
  clientIp: string;

  @Column("int", { name: "category_id" })
  categoryId: number;

  @Column("int", { name: "frequency", comment: "答题次数" })
  frequency: number;

  @Column("datetime", { name: "create_time" })
  createTime: Date;

  @Column("int", { name: "accuracy_rate", comment: "平均答题准确率" })
  accuracyRate: number;

  @PrimaryGeneratedColumn({ type: "int", name: "record_id" })
  recordId: number;

  @ManyToOne(
    () => QuestionCategory,
    (questionCategory) => questionCategory.questionRecords,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: QuestionCategory;
}
