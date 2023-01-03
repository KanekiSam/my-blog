import { Injectable, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, LessThan, MoreThan, Raw, Repository } from 'typeorm';
import { Article } from 'src/entities/Article.entity';
import { RequestParams } from './article.controller';
import { ArticleLike } from 'src/entities/ArticleLike.entity';

@Injectable()
export class ArticleService {
  // 使用InjectRepository装饰器并引入Repository这样就可以使用typeorm的操作了
  constructor(
    @InjectRepository(Article)
    private readonly repository: Repository<Article>,
    @InjectRepository(ArticleLike)
    private readonly articleLikeDb: Repository<ArticleLike>,
  ) {}

  async saveOne(user: Article) {
    if (user.articleId) {
      return await this.repository.update(user.articleId, user);
    }
    return await this.repository.save(user);
  }
  // 获取所有用户数据列表(userRepository.query()方法属于typeoram)
  async findAll(req): Promise<Article[]> {
    // const page = req.page || 1;
    // const size = req.size || 1000;
    const { keyword } = req;
    const titleList = await this.repository.find({
      where: { title: ILike(`%${keyword}%`), state: 1 },
      select: ['articleId', 'title', 'keyword'],
    });
    const wordList = await this.repository.find({
      where: { keyword: ILike(`%${keyword}%`), state: 1 },
      select: ['articleId', 'title', 'keyword'],
    });
    const arr = [];
    titleList.forEach((item) => {
      if (!arr.find((obj) => item.articleId === obj.articleId)) {
        arr.push(item);
      }
    });
    wordList.forEach((item) => {
      if (!arr.find((obj) => item.articleId === obj.articleId)) {
        arr.push(item);
      }
    });
    return arr;
  }
  /**分页查询文章列表 */
  async findByPage(req: RequestParams): Promise<[Article[], number]> {
    const page = req.page || 1;
    const size = req.size || 1000;
    let params: any = {
      state: 1,
    };
    if (req.articleTypeId) {
      params.articleTypeId = req.articleTypeId;
    }
    const total = await this.repository.count(params);
    // let articleP = this.repository
    //   .createQueryBuilder('article')
    //   .leftJoinAndMapMany(
    //     'article.comments',
    //     'article.comments',
    //     'comments',
    //     // 'comments.articleId = article.articleId',
    //   )
    //   .leftJoinAndMapOne(
    //     'article.articleType',
    //     'article.articleType',
    //     'articleType',
    //   );
    // if (req.articleTypeId) {
    //   articleP = articleP.where('article.articleTypeId = :id', {
    //     id: req.articleTypeId,
    //   });
    // }
    // const data = await articleP
    //   .skip((page - 1) * size)
    //   .take(size)
    //   .getMany();
    const data = await this.repository.find({
      where: params,
      relations: ['comments', 'articleType', 'articleLikes'],
      skip: (page - 1) * size,
      take: size,
      order: { publishTime: 'DESC' },
    });
    return [data, total];
  }
  /**查找文章 */
  async findOne(req) {
    return this.repository.findOne(req.id);
  }
  /**删除文章 */
  async deleteOne(req) {
    return this.repository.update(req.id, { state: 0 });
  }
  /**获取上一篇和下一篇文章 */
  async getNear({ id }) {
    const prev = await this.repository.find({
      select: ['articleId', 'title', 'imageUrls'],
      where: {
        articleId: LessThan(id),
        state: 1,
      },
      order: {
        articleId: 'DESC',
      },
      take: 1,
    });
    // console.log(prev)
    const next = await this.repository.find({
      select: ['articleId', 'title', 'imageUrls'],
      where: {
        articleId: MoreThan(id),
        state: 1,
      },
      order: {
        articleId: 'ASC',
      },
      take: 1,
    });
    return { prev, next };
  }
  /**获取点赞数量 */
  async getLikeNum({ articleId }) {
    const [data, num] = await this.articleLikeDb.findAndCount({
      where: { articleId, isLike: 1 },
    });
    return num;
  }
  /**点赞和取消点赞 */
  async giveLike(data: ArticleLike) {
    const res = await this.articleLikeDb.findOne({
      where: { articleId: data.articleId, clientIp: data.clientIp },
    });
    if (res) {
      return await this.articleLikeDb.save({
        id: res.id,
        isLike: res.isLike === 1 ? 2 : 1,
      });
    }
    return await this.articleLikeDb.save({
      ...data,
      isLike: 1,
    });
  }
  /**查看是否喜欢该文章 */
  async getLikeOrNot({ clientIp, articleId }) {
    const res = await this.articleLikeDb.findOne({
      where: { articleId, clientIp },
    });
    return res ? res.isLike === 1 : false;
  }
  /**添加浏览记录 */
  async addSeeCount({ articleId }) {
    const res = await this.repository.findOne({
      where: { articleId },
    });
    const { readPeople = 0 } = res;
    return await this.repository.save({
      articleId: res.articleId,
      readPeople: readPeople + 1,
    });
  }
  /**微博文章总数查询 */
  async getArticleStatics() {
    const [_, articleCount] = await this.repository.findAndCount({
      where: { state: 1 },
    });
    const [__, likesCount] = await this.articleLikeDb.findAndCount();
    const hotSeeTop = await this.repository.find({
      select: ['articleId', 'title', 'readPeople'],
      where: { state: 1, readPeople: MoreThan(0) },
      order: { readPeople: 'DESC' },
      take: 5,
    });
    const hotComment = await this.repository.find({
      select: ['articleId', 'title'],
      relations: ['comments'],
      where: { state: 1 },
    });
    const hotCommentTop = hotComment
      .filter((item) => item.comments.length > 0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 5)
      .map((item) => {
        item['commentNum'] = item.comments.length;
        delete item.comments;
        return item;
      });
    return {
      articleCount,
      likesCount,
      hotSeeTop,
      hotCommentTop,
    };
  }
}
