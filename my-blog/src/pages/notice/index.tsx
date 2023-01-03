import { httpGet } from '@/utils/request';
import { Card, Empty, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import styles from './index.less';
import { history, useModel } from 'umi';
import { RollbackOutlined } from '@ant-design/icons';
import moment from 'moment';
import classNames from 'classnames';

const { TabPane } = Tabs;

interface Props {}
const Notice: React.FC<Props> = (props) => {
  const [tab, setTab] = useState('1');
  const [unreadList, setUnreadList] = useState([]);
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [readlist, setReadlist] = useState([]);
  const { readMessage } = useModel('global', (model) => ({
    readMessage: model.readMessage,
  }));
  const getMessageList = (page: number = 1, curTab = tab) => {
    httpGet('/message/getList', {
      page,
      isRead: curTab === '1' ? 0 : 1,
      size: 10,
    }).then(({ success, data: { list, total: t } = {} }) => {
      if (success && list) {
        if (curTab === '1') {
          if (page === 1) {
            setUnreadList(list);
          } else {
            const arr = _.cloneDeep(unreadList);
            arr.push(...list);
            setUnreadList(arr);
          }
          setPage1(page);
          setTotal1(t);
        } else {
          if (page === 1) {
            setReadlist(list);
          } else {
            const arr = _.cloneDeep(readlist);
            arr.push(...list);
            setReadlist(arr);
          }
          setPage2(page);
          setTotal2(t);
        }
      }
    });
  };
  useEffect(() => {
    getMessageList(1, '1');
    getMessageList(1, '2');
  }, []);
  const gotoDoc = (item: any) => {
    if (item.typeId === 1) {
      /** 文章 */
      history.push({
        pathname: '/articlePage',
        query: { id: item.objectId },
      });
    } else if (item.typeId === 2) {
      /**题目 */
      history.push({
        pathname: '/question/bank',
        query: { questionId: item.objectId },
      });
    }
  };
  const tabList = (arr) => {
    const t = tab === '1' ? total1 : total2;
    return (
      <div className={styles.noticeWrapper}>
        {arr.length ? (
          arr.map((item, index) => (
            <div
              key={index}
              className={classNames(styles.noticeItem, {
                [styles.read]: tab === '2',
              })}
              onClick={() => {
                if (tab === '1') {
                  readMessage(item.messageId).then(({ success }) => {
                    if (success) {
                      gotoDoc(item);
                    }
                  });
                } else {
                  gotoDoc(item);
                }
              }}
            >
              <div className={styles.content}>
                <div className={styles.time}>
                  {item.createTime
                    ? moment(item.createTime).format('YYYY-MM-DD HH:mm')
                    : ''}
                  {tab === '2' ? (
                    <span>
                      ~
                      {item.readTime
                        ? moment(item.readTime).format('YYYY-MM-DD HH:mm')
                        : ''}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                {item.msgContent}
              </div>
              {item.thumbUp ? (
                <div className={classNames(styles.info)}>
                  <img src={require('../../static/img/赞.png')} />
                  <span className={styles.thumbUp}>+{item.thumbUp}</span>
                </div>
              ) : (
                ''
              )}
              {item.commentNum ? (
                <div className={classNames(styles.info)}>
                  <img src={require('../../static/img/评论.png')} />
                  <span className={styles.comment}>+{item.commentNum}</span>
                </div>
              ) : (
                ''
              )}
            </div>
          ))
        ) : (
          <Empty description="暂无新的消息" />
        )}
        {t && t > arr.length ? (
          <div
            className={styles.more}
            onClick={() => {
              const page = tab === '1' ? page1 : page2;
              getMessageList(page + 1);
            }}
          >
            加载更多
          </div>
        ) : (
          ''
        )}
        {t && t === arr.length ? (
          <div className={styles.footer}>到底啦～</div>
        ) : (
          ''
        )}
      </div>
    );
  };
  const readAll = () => {
    httpGet('/message/readAllMsg').then(({ success }) => {
      if (success) {
        getMessageList(1, '1');
        getMessageList(1, '2');
      }
    });
  };
  return (
    <Card style={{ marginTop: 15 }} className={styles.cardWrapper}>
      <h3 className={styles.title}>
        系统消息
        <RollbackOutlined
          className={styles.goBack}
          onClick={() => {
            history.push('/');
          }}
        />
      </h3>
      <Tabs
        defaultActiveKey="1"
        onChange={(key) => setTab(key)}
        tabBarExtraContent={
          tab === '1' && total1 ? <a onClick={readAll}>一键已读</a> : ''
        }
      >
        <TabPane tab="未读消息" key="1">
          {tabList(unreadList)}
        </TabPane>
        <TabPane tab="已读消息" key="2">
          {tabList(readlist)}
        </TabPane>
      </Tabs>
    </Card>
  );
};
export default Notice;
