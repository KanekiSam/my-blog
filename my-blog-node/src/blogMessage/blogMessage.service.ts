import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogMessageType } from 'entities/BlogMessageType';
import { BlogMessage } from 'src/entities/BlogMessage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogMessageService {
  constructor(
    @InjectRepository(BlogMessage)
    private readonly repository: Repository<BlogMessage>,
    @InjectRepository(BlogMessageType)
    private readonly typeRepository: Repository<BlogMessageType>,
  ) {}

  async getMessage(data: { isRead: number; page?: number; size?: number }) {
    const params: any = {};
    const page = data.page || 1;
    const size = data.size || 1000;
    if (typeof data.isRead === 'string') {
      params.isRead = Number(data.isRead);
    }
    const total = await this.repository.count(params);
    const list = await this.repository.find({
      order: {
        ...(params.isRead == 0 ? { createTime: 'DESC' } : { readTime: 'DESC' }),
        isRead: data.isRead ? undefined : 'ASC',
      },
      where: params,
      skip: (page - 1) * size,
      take: size,
    });
    return { list, total };
  }
  async getMessageNum() {
    return await this.repository.count({ isRead: 0 });
  }

  async createMessage(
    data: BlogMessage & { addThumpUp: boolean; addComment: boolean },
  ) {
    const messageObj = await this.repository.findOne({
      isRead: 0,
      typeId: data.typeId,
      objectId: data.objectId,
    });
    if (messageObj) {
      const params = {
        messageId: messageObj.messageId,
        thumbUp: messageObj.thumbUp,
        commentNum: messageObj.commentNum,
      };
      if (typeof data.addThumpUp === 'boolean') {
        params.thumbUp = data.addThumpUp
          ? messageObj.thumbUp + 1
          : messageObj.thumbUp - 1;
        params.thumbUp = params.thumbUp < 0 ? 0 : params.thumbUp;
      }
      if (typeof data.addComment === 'boolean') {
        params.commentNum = data.addComment
          ? messageObj.commentNum + 1
          : messageObj.commentNum;
      }
      return await this.repository.save(params);
    }
    const result = await this.typeRepository.findOne(data.typeId);
    if (result) {
      const regexp = /(?<=\$\{)(.+?)(?=\})/g;
      let template = result.template;
      const list = template.match(regexp);
      list.forEach((item) => {
        template = template.replace('${' + item + '}', `“ ${data[item]} “`);
      });
      data.msgContent = template;
    }
    data.createTime = new Date();
    data.isRead = 0;
    data.thumbUp =
      typeof data.addThumpUp === 'boolean' && data.addThumpUp ? 1 : 0;
    data.commentNum =
      typeof data.addComment === 'boolean' && data.addComment ? 1 : 0;
    return await this.repository.save(data);
  }

  async readMessage(msgId) {
    this.repository.update(msgId, { isRead: 1, readTime: new Date() });
  }

  async readAllMessage(msgId) {
    const ids = await this.repository.find({
      where: { isRead: 0 },
      select: ['messageId'],
    });
    if (ids) {
      return await this.repository.update(
        ids.map((item) => item.messageId),
        {
          isRead: 1,
          readTime: new Date(),
        },
      );
    }
    return false;
  }
}
