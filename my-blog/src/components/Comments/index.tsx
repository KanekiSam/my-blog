import { httpPost } from '@/utils/request';
import { Input, message } from 'antd';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import styles from './index.less';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { TokenUtils } from '@/utils/token';

interface Props {
  parentId?: number;
  articleId?: number;
  onClose: (
    obj: { username: string; content: string },
    clb: () => void,
  ) => void;
}
const key = 'bigbuserName'.toUpperCase();
const Comments: React.FC<Props> = (props) => {
  const { refreshRightCount } = useModel('global', (model) => ({
    refreshRightCount: model.refreshRightCount,
  }));
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const { userInfo } = TokenUtils.getToken();

  const onAdd = () => {
    if (!userInfo?.userId && !username) {
      return message.warning('评论名称不能为空');
    }
    if (!content) {
      return message.warning('评论内容不能为空');
    }
    props.onClose({ username, content }, () => {
      Cookies.set(key, username);
      refreshRightCount();
    });
  };
  useEffect(() => {
    const name = Cookies.get(key);
    if (name) {
      setUsername(name);
    }
  }, []);
  return (
    <div className={styles.comments}>
      <textarea
        maxLength={200}
        rows={4}
        placeholder="快来说说你的想法"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={styles.footer}>
        {!userInfo?.userId ? (
          <Input
            placeholder="你的大名"
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        ) : (
          ''
        )}
        <button className={styles.btn} onClick={onAdd}>
          发表评论
        </button>
      </div>
    </div>
  );
};
export default Comments;
