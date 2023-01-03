import {
  CalendarOutlined,
  DesktopOutlined,
  EyeOutlined,
  FileTextOutlined,
  LikeOutlined,
  Loading3QuartersOutlined,
  MessageOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import classNames from 'classnames';
import styles from '../index.less';
import { httpGet } from '@/utils/request';
import { useEffect } from 'react';
import { useLocation, history, useModel } from 'umi';
import moment from 'moment';

interface Props {}
const RightSide: React.FC<Props> = (props) => {
  const [hotTab, setHotTab] = useState(0);
  const [loadTime, setLoadTime] = useState(0);
  const tabList = [
    { tab: <EyeOutlined />, key: 0 },
    { tab: <MessageOutlined />, key: 1 },
  ];

  const today = new Date();
  const diff = today.getTime() - new Date('2021-08-26 00:00:00').getTime();
  const days = Math.floor(diff / (24 * 3600 * 1000));
  const { totalJSHeapSize = 0 } = window.performance.memory || {};
  const { countRefresh } = useModel('global', (model) => ({
    countRefresh: model.countRefresh,
  }));
  /**热门排行等相关获取 */
  const [countInfo, setCountInfo] = useState<any>({
    hotCommentTop: [],
    hotSeeTop: [],
  });
  const [commentList, setCommentList] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const getCount = () => {
    httpGet('/article/getArticleCount').then(({ success, data }) => {
      if (success) {
        setCountInfo(data);
      }
    });
    httpGet('/comment/commentCount').then(({ success, data }) => {
      if (success) {
        setCommentCount(data);
      }
    });
    httpGet('/comment/getNewComment').then(({ success, data }) => {
      if (success) {
        setCommentList(data);
      }
    });
  };
  const countList = [
    { icon: <FileTextOutlined />, title: '文章数目', num: countInfo.articleCount },
    { icon: <LikeOutlined />, title: '点赞数目', num: countInfo.likesCount },
    { icon: <MessageOutlined />, title: '评论数目', num: commentCount },
    { icon: <CalendarOutlined />, title: '运行天数', num: days },
    // { icon: <ClockCircleOutlined />, title: '响应耗时', num: `${loadTime}ms` },
    {
      icon: <DesktopOutlined />,
      title: '内存占用',
      num: `${(totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
    },
    {
      icon: <Loading3QuartersOutlined />,
      title: '渲染耗时',
      num: `${loadTime}ms`,
    },
  ];
  const onLoad = () => {
    const _loadTime =
      window.performance.timing.domContentLoadedEventEnd -
      window.performance.timing.navigationStart;
    setLoadTime(_loadTime);
  };

  useEffect(() => {
    getCount();
    window.onload = onLoad;
    return () => {
      window.onload = null;
    };
  }, [countRefresh]);
  const _location = useLocation();
  const gotoArticle = (id) => {
    history[_location.pathname !== '/articlePage' ? 'push' : 'replace']({
      pathname: '/articlePage',
      query: { id },
    });
    window.scrollTo({ top: 0 });
  };
  return (
    <div className={styles.sideWrapper}>
      <div className={styles.siteBox}>
        <div className={styles.siteWrapper}>
          <div className={styles.banner}>
            {tabList.map((item) => (
              <div
                className={classNames(styles.bannerTab, {
                  [styles.active]: hotTab === item.key,
                })}
                key={item.key}
                onClick={() => setHotTab(item.key)}
              >
                {item.tab}
              </div>
            ))}
          </div>
          <div
            className={classNames(styles.tabContent, styles.tabItem, {
              [styles.active]: hotTab === 0,
            })}
          >
            <div className={styles.title}>热门文章</div>
            <div className={styles.articleList}>
              {countInfo.hotSeeTop.map((item) => (
                <div
                  className={styles.articleItem}
                  key={item.articleId}
                  onClick={() => {
                    gotoArticle(item.articleId);
                  }}
                >
                  <img src={require('@/static/img/toux.jpg')} alt="" />
                  <div className={styles.articleDesc}>
                    <div className={styles.articleTitle}>{item.title}</div>
                    <div className={styles.count}>
                      <EyeOutlined className={styles.icon} />
                      {item.readPeople || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={classNames(styles.tabContent, styles.tabItem, {
              [styles.active]: hotTab === 1,
            })}
          >
            <div className={styles.title}>最新评论</div>
            <div className={styles.articleList}>
              {commentList.map((item, i) => (
                <div className={styles.articleItem} key={item.commentId}>
                  <img
                    src={require(`@/pages/img/user/user-${i + 1}.png`)}
                    alt=""
                  />
                  <div className={styles.articleDesc}>
                    <div
                      className={classNames(
                        styles.articleTitle,
                        'text-limit-2',
                      )}
                    >
                      {item.commentContent}
                    </div>
                    <div className={styles.count}>
                      {item.createTime
                        ? moment(item.createTime).format('YYYY-MM-DD HH:mm')
                        : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.siteBox}>
        <div className={styles.siteWrapper}>
          <div className={classNames(styles.tabContent, styles.active)}>
            <div className={styles.title}>微博信息</div>
            <div className={styles.countList}>
              {countList.map((item) => (
                <div className={styles.countItem} key={item.title}>
                  <div>
                    {item.icon}
                    <span className={styles.countTitle}>{item.title}</span>
                  </div>
                  <span className={styles.tag}>{item.num}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightSide;
