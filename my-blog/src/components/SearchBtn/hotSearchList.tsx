import { DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import cookies from 'js-cookie';
import styles from './index.less';
import { Empty } from 'antd';
import { forwardRef } from 'react';
import { httpGet, httpPost } from '@/utils/request';
import { useDebounceFn } from '@umijs/hooks';
import { history } from 'umi';

const historykey = 'bigbsearchHistory'.toUpperCase();
interface Props {
  keyword: string;
  setKeyword: (str: string) => void;
  preventDefault: () => void;
}
const HotSearchList = forwardRef((props: Props, ref: any) => {
  const { keyword = '' } = props;
  const [showList, setShowList] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState([]);
  const getColorTip = (targetO: string, keyO: string) => {
    if (!targetO || !keyO) return '';
    const target = targetO.toLowerCase();
    const key = keyO.toLowerCase();
    const index = target.indexOf(key);
    if (index > -1) {
      const prev = targetO.slice(0, index);
      const content = targetO.slice(index, index + key.length);
      const next = targetO.slice(index + key.length);
      return (
        <span>
          {prev}
          <span style={{ color: '#FF5A4D' }}>{content}</span>
          {next}
        </span>
      );
    }
    return targetO;
  };
  const addSearchCount = (key: string) => {
    if (!key) {
      return;
    }
    return new Promise<void>((r, j) => {
      httpPost('/hotSearch/addOne', { keyword: key })
        .then(({ success, data }) => {
          if (success) {
            r();
          }
        })
        .finally(() => {
          j();
        });
    });
  };
  const onListClick = (item: any) => {
    props.setKeyword(item.title);
    addHistory(item.title);
    addSearchCount(item.title);
    setTimeout(() => {
      history.push({
        pathname: '/articlePage',
        query: { id: item.articleId },
      });
    }, 500);
  };
  const addHistory = (str: string) => {
    if (!str) {
      return;
    }
    let _historyList = cookies.get(historykey);
    _historyList = _historyList ? JSON.parse(_historyList) : [];
    const index = _historyList.findIndex((item: string) => item === str);
    if (index === -1) {
      _historyList.unshift(str);
    } else {
      _historyList.splice(index, 1);
      _historyList.unshift(str);
    }
    setHistoryList(_historyList);
    cookies.set(historykey, JSON.stringify(_historyList));
  };
  const onSearch = () => {
    if (!keyword) {
      setShowList(false);
      setDataList([]);
      return;
    }
    httpGet('/article/getList', { keyword }).then(({ success, data }) => {
      if (success) {
        setDataList(data);
        addHistory(keyword);
        setShowList(true);
      }
    });
  };
  const { run } = useDebounceFn(onSearch, 500);
  useImperativeHandle(ref, () => ({
    onListClick,
    setDataList,
    onSearch: () => {
      run();
    },
    clearInput: () => {
      setDataList([]);
      setShowList(false);
    },
  }));
  useEffect(() => {
    let _historyList = cookies.get(historykey);
    _historyList = _historyList ? JSON.parse(_historyList) : [];
    setHistoryList(_historyList);
  }, []);
  return (
    <div>
      {showList ? (
        <div className={styles.searchDataList}>
          {dataList.length ? (
            <div>
              {dataList.map((item) => {
                const keywords: string[] = item.keyword
                  ? item.keyword.split(',')
                  : [];
                return (
                  <div
                    className={styles.dataItem}
                    key={item.articleId}
                    onClick={() => {
                      onListClick(item);
                    }}
                  >
                    <div className={styles.searchTitle}>
                      {getColorTip(item.title, keyword)}
                    </div>
                    <div className={styles.tagList}>
                      {keywords.map((item) => (
                        <span className={styles.tagItem}>
                          {getColorTip(item, keyword)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className={styles.endList}>没有更多了</div>
            </div>
          ) : (
            <Empty description="暂无相关文章" />
          )}
        </div>
      ) : historyList.length ? (
        <div className={styles.historyListWrapper}>
          <div className={styles.title}>
            搜索历史
            <DeleteOutlined
              className={styles.deleteIcon}
              onClick={() => {
                props.preventDefault();
                cookies.remove(historykey);
                setHistoryList([]);
              }}
            />
          </div>
          <div className={styles.historyList}>
            {historyList.map((item) => (
              <div
                key={item}
                className={styles.tagItem}
                onClick={() => {
                  props.preventDefault();
                  props.setKeyword(item);
                  run();
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Empty description="暂无搜索历史" />
      )}
    </div>
  );
});
export default HotSearchList;
