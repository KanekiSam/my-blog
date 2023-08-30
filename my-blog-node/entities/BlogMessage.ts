import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BlogMessageType } from "./BlogMessageType";

@Index("blog_message_FK", ["typeId"], {})
@Entity("blog_message", { schema: "blog" })
export class BlogMessage {
  @Column("int", { name: "type_id", comment: "消息类型" })
  typeId: number;

  @Column("varchar", { name: "msg_content", comment: "消息内容", length: 1000 })
  msgContent: string;

  @Column("int", {
    name: "is_read",
    comment: "0未读，1已读",
    default: () => "'0'",
  })
  isRead: number;

  @Column("datetime", { name: "create_time", comment: "创建时间" })
  createTime: Date;

  @Column("int", {
    name: "thumb_up",
    comment: "点赞数量",
    default: () => "'0'",
  })
  thumbUp: number;

  @Column("int", {
    name: "comment_num",
    comment: "评论数量",
    default: () => "'0'",
  })
  commentNum: number;

  @Column("int", { name: "object_id", comment: "主体id" })
  objectId: number;

  @Column("varchar", { name: "client_ip", nullable: true, length: 30 })
  clientIp: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "message_id" })
  messageId: number;

  @Column("datetime", {
    name: "read_time",
    nullable: true,
    comment: "阅读时间",
  })
  readTime: Date | null;

  @ManyToOne(
    () => BlogMessageType,
    (blogMessageType) => blogMessageType.blogMessages,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "type_id", referencedColumnName: "typeId" }])
  type: BlogMessageType;
}
