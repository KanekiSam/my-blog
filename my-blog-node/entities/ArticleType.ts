import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article";

@Entity("article_type", { schema: "blog" })
export class ArticleType {
  @Column("varchar", {
    name: "article_type_name",
    nullable: true,
    comment: "文章类型称谓",
    length: 30,
  })
  articleTypeName: string | null;

  @Column("varchar", {
    name: "article_type_desc",
    nullable: true,
    comment: "文章类型描述",
    length: 300,
  })
  articleTypeDesc: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "article_type_id" })
  articleTypeId: number;

  @OneToMany(() => Article, (article) => article.articleType)
  articles: Article[];
}
