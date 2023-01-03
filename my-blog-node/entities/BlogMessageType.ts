import { Column, Entity, OneToMany } from "typeorm";
import { BlogMessage } from "./BlogMessage";

@Entity("blog_message_type", { schema: "blog" })
export class BlogMessageType {
  @Column("int", { primary: true, name: "type_id" })
  typeId: number;

  @Column("varchar", { name: "title", length: 100 })
  title: string;

  @Column("varchar", { name: "template", length: 100 })
  template: string;

  @OneToMany(() => BlogMessage, (blogMessage) => blogMessage.type)
  blogMessages: BlogMessage[];
}
