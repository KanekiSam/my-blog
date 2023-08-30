import Comments from '@/components/Comments';
import { httpGet, httpPost } from '@/utils/request';
import {
  EyeOutlined,
  FacebookOutlined,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  QqOutlined,
  RocketOutlined,
  RollbackOutlined,
  SmileOutlined,
  TwitterOutlined,
  UserOutlined,
  WechatOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { history, useLocation, useModel } from 'umi';
import styles from './index.less';
import emptyImg from '../home/img/empty.jpg';
import CommentItem from './components/commentItem';
import { message, Space, Tooltip } from 'antd';
import { TokenUtils } from '@/utils/token';
import ClipboardJS from 'clipboard';
import classNames from 'classnames';

const prefixCls = 'article-';
interface Props {}
const Article: React.FC<Props> = (props) => {
  const [showInput, setShowInput] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const [nearList, setNearList] = useState({ prev: [], next: [] });
  const [commentList, setCommentList] = useState([]);
  const _location: any = useLocation() || {};
  const [isLike, setIsLike] = useState(false);
  const { query = {} } = _location;
  const domRef = useRef<boolean>(true);
  const { refreshRightCount, addMessage } = useModel('global', (model) => ({
    refreshRightCount: model.refreshRightCount,
    addMessage: model.addMessage,
  }));
  const getNearArticle = () => {
    httpGet('/article/getNear', { id: query.id }).then(({ success, data }) => {
      if (success) {
        console.log(data);
        setNearList(data);
      }
    });
  };
  useEffect(() => {
    if (query.id) {
      window.scrollTo({ top: 0 });
      getNearArticle();
      httpGet('/article/getById', { id: query.id }).then(
        ({ success, data }) => {
          if (success) {
            setDetail(data);
            const eles = document.getElementsByTagName('table');
            if (eles.length) {
              [...eles].forEach((dom) => {
                dom.border = '1';
                dom.width = 'auto';
              });
            }
          }
        },
      );
      queryComments();
    }
  }, [query.id]);
  const getStyles = (name: string) => {
    return styles[`${prefixCls}${name}`];
  };
  const prevObj = nearList.prev?.[0];
  const nextObj = nearList.next?.[0];
  const renderList = (list, olList, level) => {
    const arr = [...list];
    arr.forEach((item) => {
      item.level = level;
      const child = olList.filter((obj) => obj.parentId === item.commentId);
      if (child.length) {
        item.children = child;
        renderList(item.children, olList, level + 1);
      }
    });
    return arr;
  };
  const queryComments = () => {
    httpGet('/comment/commentList', { articleId: query.id }).then(
      ({ success, data }) => {
        if (success) {
          console.log(data);
          const mapList = renderList(
            data.filter((item) => item.parentId === null),
            data,
            1,
          );
          setCommentList(mapList);
        }
      },
    );
  };
  const giveLike = () => {
    httpPost('/article/saveLike', {
      articleId: query.id,
    }).then(({ success }) => {
      if (success) {
        const like = !isLike;
        setIsLike(like);
        addMessage({ like, objectId: query.id, title: detail.title });
        refreshRightCount();
      }
    });
  };
  const queryLike = () => {
    httpGet('/article/islike', { articleId: query.id }).then(
      ({ success, data }) => {
        if (success) {
          setIsLike(data);
        }
      },
    );
  };
  const addSee = () => {
    httpGet('/article/addSee', { articleId: query.id }).then(({ success }) => {
      if (success) {
        refreshRightCount();
      }
    });
  };
  useEffect(() => {
    queryLike();
    addSee();
  }, [query.id]);
  const getoArticle = (id) => {
    history.replace({ query: { id } });
    refreshRightCount();
  };
  const keywords = detail.keyword ? detail.keyword.split(',') : [];
  const { userInfo } = TokenUtils.getToken();
  const getText = () => {
    if (userInfo.userName === 'bigB') {
      return isLike ? '我很满意' : '给自己加油';
    }
    return isLike ? '谢谢你的鼓励' : '给作者点个赞';
  };
  const copyTxt = `作者：bigB\n链接：${window.location.href}\n来源：bigB个人博客\n著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。`;
  useEffect(() => {
    /** 监听copy事件 */
    document.addEventListener('copy', (e) => {
      const txt = `${window?.getSelection?.()?.toString?.()}\n\n${copyTxt}`;
      //取消默认事件，才能修改复制的值
      e.preventDefault();
      //复制的内容
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', txt);
      } else if (window.clipboardData) {
        return window.clipboardData.setData('text', txt);
      }
    });
  }, []);
  return (
    <div className={styles.article}>
      <div className={getStyles('body')}>
        <div className={getStyles('content')}>
          <RollbackOutlined
            className={styles.goBack}
            onClick={() => {
              history.goBack();
            }}
          />
          <div className={getStyles('title')}>{detail.title}</div>
          <div className={getStyles('date')}>
            <span className={getStyles('author')}>bigB</span>
            {detail.publishTime
              ? moment(detail.publishTime).format('YYYY-MM-DD')
              : ''}
          </div>
          {detail.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: detail.content }}
              className={styles.articleHtml}
              id="articleHtml"
              ref={(dom) => {
                if (dom && domRef.current) {
                  domRef.current = false;
                  const eles = [...dom.getElementsByTagName('pre')];
                  let clipboard: any = {};
                  eles.forEach((item, i) => {
                    const key = `dataCode${i}`;
                    item.setAttribute('id', key);
                    item.setAttribute('data-clipboard-target', `#${key} code`);
                    item.addEventListener('click', () => {
                      if (!clipboard[i]) {
                        clipboard[i] = new ClipboardJS(`#${key}`, {
                          text: (trigger) => {
                            return trigger.getElementsByTagName('code')[0]
                              .innerText;
                          },
                        }).on('success', function (e) {
                          // console.info('Action:', e.action);
                          // console.info('Text:', e.text);
                          // console.info('Trigger:', e.trigger);
                          message.info('复制成功了');
                          e.clearSelection();
                        });
                      }
                    });
                  });
                }
              }}
            ></div>
          ) : (
            ''
          )}
          <div className={getStyles('favor')}>
            <span className={styles.iconWrapper} onClick={giveLike}>
              {isLike ? (
                <HeartFilled
                  className={styles.icon}
                  style={{ color: '#FF5A4D' }}
                />
              ) : (
                <HeartOutlined className={styles.icon} />
              )}
            </span>
            <span className={styles.text}>{getText()}</span>
          </div>
        </div>
        <div className={getStyles('footer')}>
          <div className={getStyles('footer-left')}>
            <div className={getStyles('pager')}>
              {prevObj ? (
                <div
                  className={getStyles('prev')}
                  style={!nextObj ? { width: '100%' } : {}}
                >
                  <img
                    src={prevObj.imageUrls?.split?.('|')?.[0] || emptyImg}
                    alt=""
                  />
                  <div className={getStyles('tip')}>
                    <div
                      className={classNames(
                        getStyles('pager-title'),
                        'text-limit-2',
                      )}
                    >
                      {prevObj.title}
                    </div>
                    <div
                      className={getStyles('ctrl-btn')}
                      onClick={() => {
                        getoArticle(prevObj.articleId);
                      }}
                    >
                      上一篇
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
              {nextObj ? (
                <div
                  className={getStyles('next')}
                  style={!prevObj ? { width: '100%' } : {}}
                >
                  <img
                    src={nextObj.imageUrls?.split?.('|')?.[0] || emptyImg}
                    alt=""
                  />
                  <div className={getStyles('tip')}>
                    <div
                      className={classNames(
                        getStyles('pager-title'),
                        'text-limit-2',
                      )}
                    >
                      {nextObj.title}
                    </div>
                    <div
                      className={getStyles('ctrl-btn')}
                      onClick={() => {
                        getoArticle(nextObj.articleId);
                      }}
                    >
                      下一篇
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className={getStyles('params-card')}>
              <div className={getStyles('params-title')}>
                <UserOutlined className={styles.icon} />
                文章作者
              </div>
              <div className={getStyles('params-content')}>
                <div className={styles.avator}>
                  <img src={require('../../static/img/toux.jpg')} alt="" />
                </div>
                <div className={styles.info}>
                  <div className={styles.author}>bigB</div>
                  <div className={styles.desc}>我是大斌哥</div>
                </div>
              </div>
            </div>
            <div className={getStyles('params-card')}>
              <div className={getStyles('params-title')}>
                <MessageOutlined className={styles.icon} />
                文章评论
              </div>
              <div className={getStyles('params-content')}>
                <div className={styles['ctrl-input']}>
                  <div
                    className={styles.title}
                    onClick={() => setShowInput(!showInput)}
                  >
                    <SmileOutlined className={styles.icon} />
                    <div className={styles.btn}>
                      {showInput ? '发表评论' : '说点什么'}
                    </div>
                  </div>
                  {showInput ? (
                    <Comments
                      onClose={({ username, content }, clb) => {
                        const { userInfo } = TokenUtils.getToken();
                        httpPost('/comment/addComment', {
                          userName: username,
                          commentContent: content,
                          articleId: query.id,
                          userId: userInfo?.userId,
                        }).then(({ success, data }) => {
                          if (success) {
                            message.success('评论成功');
                            clb();
                            addMessage({
                              comment: true,
                              objectId: query.id,
                              title: detail.title,
                            });
                            setShowInput(false);
                            queryComments();
                          }
                        });
                      }}
                      articleId={query.id}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <div className={getStyles('comments-list')}>
              {commentList.length ? (
                <div className={styles.commentList}>
                  {commentList.map((item, index) => (
                    <CommentItem
                      queryComments={queryComments}
                      item={item}
                      index={index}
                      title={detail.title}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.empty}>
                  <RocketOutlined className={styles.icon} />
                  还没有评论
                </div>
              )}
            </div>
          </div>

          <div className={getStyles('footer-right')}>
            <div className={getStyles('params-card')}>
              <div className={styles.relationList}>
                <WeiboOutlined className="text-red" />
                <Tooltip
                  title={
                    <img
                      style={{ width: 150, height: 150 }}
                      src={require('../../static/img/qq.jpg')}
                    />
                  }
                  placement="bottom"
                >
                  <QqOutlined className="text-blue" />
                </Tooltip>
                {/* <Tooltip
                  title={
                    <img
                      style={{ width: 150, height: 150 }}
                      src={require('../../static/img/weixin.jpg')}
                    />
                  }
                  placement="bottom"
                > */}
                <WechatOutlined className="text-green" />
                {/* </Tooltip> */}
                <FacebookOutlined className="text-purple" />
                <TwitterOutlined className="text-cyan" />
              </div>
            </div>
            <div className={getStyles('params-card')}>
              <div className={styles['params-card-title']}>文章关键词</div>
              <div className="tagList">
                {keywords.map((item, i) => (
                  <div key={i} className="tagItem">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Article;
