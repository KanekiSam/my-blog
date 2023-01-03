import { httpGet, httpPost } from '@/utils/request';
import { TokenUtils } from '@/utils/token';
import { useEffect, useRef, useState } from 'react';

export default () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  /**右侧计算相关刷新 */
  const [countRefresh, setCountRefresh] = useState(false);
  const refreshRightCount = () => {
    setCountRefresh(!countRefresh);
  };
  const [refresh, setRefresh] = useState(false);
  const onRefresh = () => {
    setRefresh(!refresh);
  };

  const checkToken = () => {
    httpGet('/auth/checkToken', {}, { noErrorTip: true }).then(
      ({ success, status }) => {
        if (success) {
          setIsLogin(true);
        } else if (status === 401) {
          TokenUtils.clearToken();
          setIsLogin(false);
        }
      },
    );
  };
  /** 消息订阅 */
  const addMessage = (obj: {
    like?: boolean;
    comment?: boolean;
    objectId: number;
    title: string;
    subTitle?: string;
    typeId?: number;
  }) => {
    const { like, comment, objectId, title, subTitle, typeId } = obj;
    httpPost(
      '/message/save',
      {
        title,
        subTitle,
        objectId,
        addThumpUp: like,
        addComment: comment,
        typeId: typeId || 1,
      },
      { noErrorTip: true },
    );
  };
  /** 阅读消息 */
  const readMessage = (id: string) => {
    return httpGet('/message/readMsg', { id }, { noErrorTip: true });
  };
  const resizeEvents = useRef<{ [key: string]: { event: Function } }>({});
  /** 全局onResize监听 */
  useEffect(() => {
    window.onresize = () => {
      Object.keys(resizeEvents.current).forEach((key) => {
        resizeEvents.current[key].event();
      });
    };
    return () => {
      window.onresize = null;
    };
  });
  return {
    showLogin,
    setShowLogin,
    refreshRightCount,
    countRefresh,
    isLogin,
    setIsLogin,
    checkToken,
    addMessage,
    readMessage,
    onRefresh,
    resizeEvents,
  };
};
