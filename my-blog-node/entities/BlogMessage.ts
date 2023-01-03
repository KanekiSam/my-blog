import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BlogMessageType } from "./BlogMessageType";

@Index("blog_message_FK", ["typeId"], {})
@Entity("blog_message", { schema: "blog" })
export class BlogMessage {
  @Column("int", { primary: true, name: "message_id" })
  messageId: number;

  @Column("int", { name: "type_id", comment: "消息类型" })
  typeId: number;

  @Column("varchar", { name: "msg_content", comment: "消息内容", length: 1000 })
  msgContent: string;

  @Column("int", { name: "msg_count", nullable: true, comment: "消息数量" })
  msgCount: number | null;

  @Column("varchar", { name: "user_name", comment: "用户名称", length: 100 })
  userName: string;

  @ManyToOne(
    () => BlogMessageType,
    (blogMessageType) => blogMessageType.blogMessages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "type_id", referencedColumnName: "typeId" }])
  type: BlogMessageType;
}
