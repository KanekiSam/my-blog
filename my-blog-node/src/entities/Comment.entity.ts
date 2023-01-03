import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './Article.entity';

@Index('comment_FK', ['userId'], {})
@Index('comment_FK_1', ['articleId'], {})
@Entity('comment', { schema: 'blog' })
export class Comment {
  @PrimaryGeneratedColumn()
  @Column('int', { name: 'comment_id', primary: true })
  commentId: string;

  @Column('varchar', {
    name: 'comment_content',
    nullable: true,
    comment: '留言评论内容',
    length: 500,
  })
  commentContent: string | null;

  @Column('int', {
    name: 'comment_grade',
    nullable: true,
    comment: '留言评论等级',
  })
  commentGrade: number | null;

  @Column('datetime', {
    name: 'create_time',
    nullable: true,
    comment: '发表时间',
  })
  createTime: Date | null;

  @Column('varchar', { name: 'user_name', nullable: true, length: 30 })
  userName: string | null;

  @Column('varchar', { name: 'client_ip', nullable: true, length: 30 })
  clientIp: string | null;

  @Column('int', { name: 'parent_id', nullable: true })
  parentId: number | null;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('longtext', { name: 'user_avator', nullable: true })
  userAvator: string | null;

  @Column('int', { name: 'article_id', nullable: true })
  articleId: number | null;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'article_id', referencedColumnName: 'articleId' }])
  article: Article;
}
