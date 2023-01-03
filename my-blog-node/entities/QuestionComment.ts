import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { QuestionBank } from "./QuestionBank";

@Index("question_comment_FK", ["questionId"], {})
@Entity("question_comment", { schema: "blog" })
export class QuestionComment {
  @Column("varchar", { name: "content", comment: "评论内容", length: 200 })
  content: string;

  @Column("datetime", { name: "create_time", comment: "评论时间" })
  createTime: Date;

  @Column("varchar", { name: "client_ip", comment: "评论来源ip", length: 100 })
  clientIp: string;

  @Column("int", { name: "question_id" })
  questionId: number;

  @Column("varchar", { name: "user_name", comment: "评论用户名称", length: 30 })
  userName: string;

  @Column("int", { name: "parent_id", nullable: true })
  parentId: number | null;

  @PrimaryGeneratedColumn({ type: "int", name: "comment_id" })
  commentId: number;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("longtext", { name: "user_avator", nullable: true })
  userAvator: string | null;

  @ManyToOne(
    () => QuestionBank,
    (questionBank) => questionBank.questionComments,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "question_id", referencedColumnName: "questionId" }])
  question: QuestionBank;
}
