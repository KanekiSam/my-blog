import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BlogMessage } from "./BlogMessage";

@Entity("blog_message_type", { schema: "blog" })
export class BlogMessageType {
  @Column("varchar", { name: "title", length: 100 })
  title: string;

  @Column("varchar", { name: "template", length: 100 })
  template: string;

  @PrimaryGeneratedColumn({ type: "int", name: "type_id" })
  typeId: number;

  @OneToMany(() => BlogMessage, (blogMessage) => blogMessage.type)
  blogMessages: BlogMessage[];
}
