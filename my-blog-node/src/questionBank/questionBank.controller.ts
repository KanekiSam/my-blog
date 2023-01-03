import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getClientIp } from 'src/utils';
import { QuestionBankService } from './questionBank.service';

@Controller('/auth/questionBank')
export class QuestionBankController {
  constructor(private readonly bankService: QuestionBankService) {}

  @Get('getList')
  async getBankList(@Req() req) {
    return await this.bankService.queryBankList(req.query.categoryId);
  }
  @Get('getCategory')
  async getCategory(@Req() req) {
    const data = await this.bankService.queryCategory();
    return data.map((item) => {
      const { questionRecords } = item;
      if (questionRecords.length) {
        const clients = [];
        const totalRate = questionRecords.reduce((p, n) => {
          if (clients.indexOf(n.clientIp) === -1) {
            clients.push(n.clientIp);
          }
          return p + n.accuracyRate;
        }, 0);
        item['participationNum'] = clients.length;
        item['averageRate'] = (totalRate / questionRecords.length).toFixed(2);
        item.questionBanks = item.questionBanks.filter(
          (item) => item.state === '1',
        );
      } else {
        item['participationNum'] = 0;
        item['averageRate'] = 0;
      }
      delete item.questionRecords;
      return item;
    });
  }

  @Get('getQuestion')
  async getQuestion(@Req() req) {
    return await this.bankService.queryQuestion(req.query.id);
  }

  @Post('addRecord')
  async addRecord(@Req() req) {
    const clientIp = getClientIp(req);
    const { body } = req;
    body.clientIp = clientIp;
    await this.bankService.addRecord(body);
    return { message: '成功' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addQuestion')
  async addQuestion(@Req() req) {
    const clientIp = getClientIp(req);
    const { body } = req;
    body.clientIp = clientIp;
    await this.bankService.addQuestion(body);
    return { message: '成功' };
  }

  @Post('addComment')
  async addComment(@Req() req) {
    const clientIp = getClientIp(req);
    const { body } = req;
    body.clientIp = clientIp;
    await this.bankService.addComments(body);
    return { message: '成功' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addCategory')
  async addCategory(@Req() req) {
    const clientIp = getClientIp(req);
    const { body } = req;
    body.clientIp = clientIp;
    await this.bankService.addCategory(body);
    return { message: '成功' };
  }
}
