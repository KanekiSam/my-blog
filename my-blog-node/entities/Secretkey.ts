import { Column, Entity } from "typeorm";

@Entity("SECRETKEY", { schema: "blog" })
export class Secretkey {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("mediumtext", { name: "val" })
  val: string;

  @Column("varchar", {
    name: "desc",
    nullable: true,
    comment: "cry-secret",
    length: 100,
  })
  desc: string | null;
}
