import { useModel } from '@/.umi/plugin-model/useModel';
import Comments from '@/components/Comments';
import { httpPost } from '@/utils/request';
import { TokenUtils } from '@/utils/token';
import { message } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import styles from '../index.less';

interface Props {
  item: any;
  queryComments: () => void;
  index: number;
  title: string;
}
const CommentItem: React.FC<Props> = (props) => {
  const [showInput, setShowInput] = useState(false);
  const { item, queryComments, index, title } = props;
  const [showMore, setShowMore] = useState(false);
  const { addMessage } = useModel('global', (model) => ({
    addMessage: model.addMessage,
  }));
  useEffect(() => {
    if (typeof item.level === 'number' && item.level < 3) {
      setShowMore(true);
    }
  }, [item]);
  return (
    <div className={styles.commentItem} key={item.articleId}>
      <div className={styles.detail}>
        <img
          src={
            item.userAvator ||
            require(`../../img/user/user-${(index % 5) + 1}.png`)
          }
          className={styles.icon}
        />
        <div>
          <div className={styles.username}>
            {item.userName}
            {item.userName === 'bigB' ? (
              <span className={styles.blogTag}>博主</span>
            ) : (
              ''
            )}
          </div>
          <div className={styles.desc}>{item.commentContent}</div>
          <div className={styles.time}>
            {item.createTime
              ? moment(item.createTime).format('YYYY-MM-DD HH:mm')
              : ''}
            <a
              className={styles.resBtn}
              onClick={() => setShowInput(!showInput)}
            >
              回复
            </a>
            {item.children?.length ? (
              <a
                className={styles.resBtn}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? '收起回复' : '查看更多'}
              </a>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {showInput ? (
        <div style={{ padding: 15 }}>
          <Comments
            onClose={({ username, content }, clb) => {
              const { userInfo } = TokenUtils.getToken();
              httpPost('/comment/addComment', {
                userId: userInfo?.userId,
                userName: username,
                commentContent: content,
                parentId: item.commentId,
                articleId: item.articleId,
              }).then(({ success, data }) => {
                if (success) {
                  message.success('评论成功');
                  clb();
                  setShowInput(false);
                  queryComments();
                  addMessage({
                    title,
                    comment: true,
                    objectId: item.articleId,
                  });
                }
              });
            }}
            articleId={item.articleId}
            parentId={item.commentId}
          />
        </div>
      ) : (
        ''
      )}

      <div
        className={styles.showMore}
        style={{ paddingLeft: 24, height: showMore ? '100%' : 0 }}
      >
        {item.children
          ? item.children.map((obj, i) => (
              <CommentItem
                item={obj}
                queryComments={queryComments}
                index={i}
                title={title}
              />
            ))
          : ''}
      </div>
    </div>
  );
};
export default CommentItem;
