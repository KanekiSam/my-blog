import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { QuestionCategory } from "./QuestionCategory";
import { QuestionComment } from "./QuestionComment";

@Index("question_bank_FK", ["categoryId"], {})
@Entity("question_bank", { schema: "blog" })
export class QuestionBank {
  @Column("varchar", {
    name: "question_content",
    comment: "题目内容",
    length: 1000,
  })
  questionContent: string;

  @Column("varchar", {
    name: "answer_options",
    comment: "答案选项",
    length: 1000,
  })
  answerOptions: string;

  @Column("varchar", { name: "correct_answer", comment: "答案", length: 100 })
  correctAnswer: string;

  @Column("varchar", {
    name: "answer_keys",
    nullable: true,
    comment: "答案解析",
    length: 1000,
  })
  answerKeys: string | null;

  @Column("int", {
    name: "question_type",
    comment: "1单选题，2多选题，3判断题",
  })
  questionType: number;

  @Column("datetime", { name: "create_time" })
  createTime: Date;

  @Column("int", { name: "category_id", comment: "题型类别" })
  categoryId: number;

  @Column("varchar", {
    name: "state",
    comment: "有效状态，1有效，2待审核",
    length: 100,
    default: () => "'2'",
  })
  state: string;

  @Column("varchar", { name: "client_ip", comment: "来源ip", length: 100 })
  clientIp: string;

  @PrimaryGeneratedColumn({ type: "int", name: "question_id" })
  questionId: number;

  @ManyToOne(
    () => QuestionCategory,
    (questionCategory) => questionCategory.questionBanks,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: QuestionCategory;

  @OneToMany(
    () => QuestionComment,
    (questionComment) => questionComment.question
  )
  questionComments: QuestionComment[];
}
