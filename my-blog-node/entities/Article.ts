import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArticleType } from "./ArticleType";
import { ArticleLike } from "./ArticleLike";
import { Comment } from "./Comment";

@Index("article_FK", ["articleTypeId"], {})
@Entity("article", { schema: "blog" })
export class Article {
  @Column("varchar", {
    name: "title",
    nullable: true,
    comment: "文章标题",
    length: 150,
  })
  title: string | null;

  @Column("datetime", {
    name: "publish_time",
    nullable: true,
    comment: "发布时间",
  })
  publishTime: Date | null;

  @Column("int", { name: "read_people", nullable: true, comment: "阅读人数" })
  readPeople: number | null;

  @Column("varchar", {
    name: "keyword",
    nullable: true,
    comment: "文章关键字",
    length: 150,
  })
  keyword: string | null;

  @Column("int", { name: "popularity", nullable: true, comment: "文章点赞数" })
  popularity: number | null;

  @Column("varchar", {
    name: "article_desc",
    nullable: true,
    comment: "文章描述",
    length: 200,
  })
  articleDesc: string | null;

  @Column("varchar", {
    name: "image_urls",
    nullable: true,
    comment: "文章首页展示图片id列表",
    length: 500,
  })
  imageUrls: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "article_id" })
  articleId: number;

  @Column("int", {
    name: "article_type_id",
    nullable: true,
    comment: "文章类型",
  })
  articleTypeId: number | null;

  @Column("int", {
    name: "state",
    comment: "1文章有效，0已删除",
    default: () => "'1'",
  })
  state: number;

  @Column("varchar", {
    name: "content",
    nullable: true,
    comment: "文章内容",
    length: 13000,
  })
  content: string | null;

  @ManyToOne(() => ArticleType, (articleType) => articleType.articles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "article_type_id", referencedColumnName: "articleTypeId" },
  ])
  articleType: ArticleType;

  @OneToMany(() => ArticleLike, (articleLike) => articleLike.article)
  articleLikes: ArticleLike[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];
}
