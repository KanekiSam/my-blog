import { useModel } from '@/.umi/plugin-model/useModel';
import Comments from '@/components/Comments';
import { httpPost } from '@/utils/request';
import { TokenUtils } from '@/utils/token';
import { message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import styles from '../index.less';

interface Props {
  item: any;
  queryComments: () => void;
  index: number;
  title: string;
  subTitle: string;
}
const CommentItem: React.FC<Props> = (props) => {
  const [showInput, setShowInput] = useState(false);
  const { item, queryComments, index, title, subTitle } = props;
  const [showMore, setShowMore] = useState(false);
  const { addMessage } = useModel('global', (model) => ({
    addMessage: model.addMessage,
  }));
  return (
    <div className={styles.commentItem} key={item.commentId}>
      <div className={styles.detail}>
        <img
          src={require(`../../img/user/user-${(index % 5) + 1}.png`)}
          className={styles.icon}
        />
        <div>
          <div className={styles.username}>{item.userName}</div>
          <div className={styles.desc}>{item.content}</div>
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
              httpPost('/auth/questionBank/addComment', {
                content,
                userId: userInfo.userId,
                userName: username,
                questionId: item.questionId,
                parentId: item.commentId,
              }).then(({ success, data }) => {
                if (success) {
                  message.success('评论成功');
                  addMessage({
                    comment: true,
                    title,
                    subTitle,
                    objectId: item.questionId,
                    typeId: 2,
                  });
                  clb();
                  setShowInput(false);
                  queryComments();
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
        style={{ padding: '0 46px', height: showMore ? '100%' : 0 }}
      >
        {item.children
          ? item.children.map((obj, i) => (
              <CommentItem
                item={obj}
                queryComments={queryComments}
                index={i}
                {...{ title, subTitle }}
              />
            ))
          : ''}
      </div>
    </div>
  );
};
export default CommentItem;
