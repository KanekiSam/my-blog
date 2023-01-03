import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("hot_search", { schema: "blog" })
export class HotSearch {
  @Column("varchar", { name: "keyword", comment: "搜索词汇", length: 100 })
  keyword: string;

  @Column("int", { name: "search_count", comment: "查询次数" })
  searchCount: number;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
}
