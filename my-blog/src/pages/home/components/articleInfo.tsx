import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import { history, useModel } from 'umi';
import {
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { httpGet } from '@/utils/request';
import styles from '../index.less';
import { message, Modal, Button, Spin } from 'antd';
import { useScroll } from '@umijs/hooks';
import LazyImg from '@/components/LazyImg';
import Walking from '@/components/Loading/walking';

const colorTags = [
  '#FFC0CB',
  '#BA55D3',
  '#DA70D6',
  '#6495ED',
  '#4169E1',
  '#32CD32',
  '#FFA500',
  '#FF7F50',
];
interface Props { }
const ArticleInfo: React.FC<Props> = (props) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(-1);
  const [articleList, setArticleList] = useState<any[]>([]);
  const [tagList, setTagList] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);

  const queryArticleList = (_page = 1, _active = active) => {
    setLoading(true);
    httpGet('/article/getListByPage', {
      size: 5,
      page: _page,
      articleTypeId: _active === -1 ? undefined : _active,
    }).then(({ success, data: { list, total: _total } }) => {
      if (success && list) {
        setTotal(_total);
        setPage(_page);

        const _articleList =
          _page == 1 ? list : [].concat(_.cloneDeep(articleList), list);
        setArticleList(_articleList);
      }
    }).finally(() => setLoading(false));
  };
  const articleMapList = useMemo(() => {
    const _articleList = articleList.filter(
      (item) => active === -1 || item.articleTypeId === active,
    );
    if (width > 630) {
      const _articleMapList = [[], [], []];
      _articleList.forEach((item, index) => {
        _articleMapList[index % 3].push(item);
      });
      return _articleMapList;
    }
    return [_articleList];
  }, [articleList, active, width]);
  const loadData = () => {
    queryArticleList();
    httpGet('/article/typeList').then(({ success, data }) => {
      if (success && typeof data === 'object') {
        data.unshift({ articleTypeName: '全部', articleTypeId: -1 });
        setTagList(data);
      }
    });
  };
  const { resizeEvents, isLogin } = useModel('global', (model) => ({
    resizeEvents: model.resizeEvents,
    isLogin: model.isLogin,
  }));
  useEffect(() => {
    loadData();
    // window.onresize = () => {
    //   console.log('onresize');
    //   setWidth(window.innerWidth);
    // };
    resizeEvents.current['home'] = {
      event: () => {
        console.log('onresize');
        setWidth(window.innerWidth);
      },
    };
    return () => {
      // window.onresize = null;
      delete resizeEvents.current['home'];
    };
  }, []);
  const curNum = articleList.filter(
    (item) => active === -1 || item.articleTypeId === active,
  ).length;
  const onDelete = (id) => {
    httpGet('/article/delete', { id }).then(({ success }) => {
      if (success) {
        setArticleList(articleList.filter((item) => item.articleId !== id));
        setTotal(total - 1);
        message.success('删除成功');
      }
    });
  };
  const [scroll] = useScroll(document.body);

  return (
    <div className={styles.articleInfoWrapper}>
      <div
        className={styles.tagListWrapper}
        style={{ marginTop: scroll.top > 20 ? 60 : 0 }}
      >
        <div className={styles.tagList}>
          {tagList.map((item, index) => (
            <div
              key={item.articleTypeId}
              className={classNames(styles.tag, {
                [styles.active]: active === item.articleTypeId,
              })}
              onClick={() => {
                setActive(item.articleTypeId);

                queryArticleList(1, item.articleTypeId);
              }}
            >
              {item.articleTypeName}
            </div>
          ))}
        </div>
      </div>
      {/* <Walking loading={loading} /> */}
      <div className={styles.articleContent}>
        <Spin spinning={loading}>
          <div className={styles.articleList} style={{ minHeight: 100 }}>
            {articleMapList.map((item, index) => (
              <div key={index} className={styles.flowWrapper}>
                {item.map((article, i) => {
                  const images = article.imageUrls
                    ? article.imageUrls.split('|')
                    : [];
                  const tag = articleMapList.length * i + (index + 1);
                  return (
                    <div
                      key={article.articleId}
                      className={styles.articleCard}
                      onClick={() => {
                        history.push({
                          pathname: '/articlePage',
                          query: { id: article.articleId },
                        });
                      }}
                    >
                      <div className={styles.head}>
                        <div
                          className={styles.tag}
                          style={{
                            backgroundColor: colorTags[tag % colorTags.length],
                            color: 'white',
                          }}
                        >
                          {article.articleType?.articleTypeName}
                        </div>
                        <span className={styles.time}>
                          {moment(article.publishTime).format(
                            'YYYY / MM / DD HH:mm',
                          )}
                        </span>
                      </div>
                      <div className={styles.title}>{article.title}</div>
                      <div className={styles.desc}>{article.articleDesc}</div>
                      <div className={styles.picList}>
                        {images.map((img, z) => (
                          <div key={z} className={styles.pic}>
                            <LazyImg src={img} />
                          </div>
                        ))}
                      </div>
                      <div className={styles.favor}>
                        <span className={styles.statistics}>
                          <EyeOutlined className={styles.icon} />
                          {article.readPeople || 0}
                        </span>
                        <span className={styles.statistics}>
                          {article.like ? (
                            <HeartFilled
                              className={styles.icon}
                              style={{ color: '#FF5A4D' }}
                            />
                          ) : (
                            <HeartOutlined className={styles.icon} />
                          )}
                          {article.popularity || 0}
                        </span>
                        <span className={styles.statistics}>
                          <MessageOutlined className={styles.icon} />
                          {article.comments.length}
                        </span>
                        {isLogin ? (
                          <div
                            style={{
                              marginLeft: 'auto',
                              display: 'flex',
                            }}
                          >
                            <Button
                              style={{ marginRight: 8 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                history.push({
                                  pathname: '/articlePage/add',
                                  query: { id: article.articleId },
                                });
                              }}
                            >
                              编辑
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                Modal.confirm({
                                  title: '提示',
                                  content: `是否确认删除《${article.title}》`,
                                  onOk: () => {
                                    onDelete(article.articleId);
                                  },
                                });
                              }}
                            >
                              删除
                            </Button>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            {!curNum ? (
              <div className={styles.empty}>
                <img src={require('../img/empty.jpg')} alt="" />
                <div>作者太懒了，这里空空如也</div>
              </div>
            ) : (
              ''
            )}
          </div>
          {total && total > articleList.length ? (
            <div className={styles.loading}>
              <div
                className={styles.more}
                onClick={() => queryArticleList(page + 1)}
              >
                加载更多
              </div>
            </div>
          ) : (
            ''
          )}
        </Spin>
        {total && total == articleList.length ? <div className={styles.bottomTip}>到底啦～</div> : ''}
      </div>
    </div>
  );
};
export default ArticleInfo;
