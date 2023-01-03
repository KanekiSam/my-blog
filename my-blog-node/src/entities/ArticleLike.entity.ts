import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './Article.entity';

@Index('article_like_FK', ['articleId'], {})
@Entity('article_like', { schema: 'blog' })
export class ArticleLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'is_like',
    comment: '1点赞，2不喜欢',
    default: () => "'2'",
  })
  isLike: number;

  @Column('varchar', {
    name: 'client_ip',
    comment: '点赞的来源ip',
    length: 100,
  })
  clientIp: string;

  @Column('int', { name: 'article_id' })
  articleId: number;

  @ManyToOne(() => Article, (article) => article.articleLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'article_id', referencedColumnName: 'articleId' }])
  article: Article;
}
