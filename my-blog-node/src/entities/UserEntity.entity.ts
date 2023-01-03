import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_entity', { schema: 'blog' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @Column('varchar', {
    name: 'user_name',
    length: 30,
    unique: true,
  })
  userName: string;

  @Column('varchar', {
    name: 'user_password',
    length: 30,
    default: () => "'123456'",
  })
  userPassword: string;

  @Column('int', {
    name: 'user_sex',
    comment: '0男，1女',
    default: () => "'0'",
  })
  userSex: number;

  @Column('date', { name: 'user_birthday', nullable: true })
  userBirthday: string | null;

  @Column('varchar', { name: 'user_birthplace', nullable: true, length: 120 })
  userBirthplace: string | null;

  @Column('varchar', { name: 'user_email', nullable: true, length: 30 })
  userEmail: string | null;

  @Column('varchar', { name: 'user_qq', nullable: true, length: 15 })
  userQq: string | null;

  @Column('varchar', {
    name: 'user_state',
    comment: '0未审核，1审核通过，2审核不通过，3禁用',
    length: 30,
    default: () => "'0'",
  })
  userState: string;

  @Column('varchar', { name: 'question', nullable: true, length: 100 })
  question: string | null;

  @Column('varchar', { name: 'answer', nullable: true, length: 30 })
  answer: string | null;

  @Column('longtext', { name: 'user_avator', nullable: true })
  userAvator: string | null;

  @Column('int', { name: 'user_type_id', nullable: true })
  userTypeId: number | null;

  @Column('boolean', { name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column('date', { name: 'create_time', nullable: true })
  createTime: Date | null;
}
