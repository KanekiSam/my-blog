import React, { useState } from 'react';
import classNames from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.less';
import { httpGet } from '@/utils/request';
import { useEffect } from 'react';
import { history } from 'umi';
import { Input } from 'antd';
import HotSearchList from '@/components/SearchBtn/hotSearchList';
import { useRef } from 'react';

const hotTagList = ['实时热搜', '热门文章'];
interface Props {}
const Search: React.FC<Props> = (props) => {
  const [keyword, setKeyword] = useState('');
  const [hotList, setHotList] = useState<any[]>([]);
  const [hotSearchList, setHotSearchList] = useState<any[]>([]);
  const hotSearchRef = useRef<any>(null);
  const getHotList = () => {
    httpGet('/article/getArticleCount').then(({ success, data }) => {
      if (success) {
        setHotList(data.hotSeeTop);
      }
    });
  };
  const getHotSearchlist = () => {
    httpGet('/hotSearch/getTop').then(({ success, data }) => {
      if (success) {
        setHotSearchList(data);
      }
    });
  };
  const [active, setActive] = useState(0);
  useEffect(() => {
    getHotList();
    getHotSearchlist();
  }, []);
  return (
    <div className={styles.search}>
      <div className={styles.inputWrapper}>
        <Input
          style={{ borderRadius: 40 }}
          placeholder="文章搜索"
          value={keyword}
          onChange={(e) => {
            console.log(e.target.value);
            setKeyword(e.target.value);
            hotSearchRef.current?.onSearch?.();
          }}
          suffix={
            <CloseOutlined
              style={{ display: keyword ? '' : 'none' }}
              onClick={() => {
                setKeyword('');
                hotSearchRef.current?.clearInput?.();
              }}
            />
          }
        />
        <a
          className={styles.back}
          onClick={() => {
            history.goBack();
          }}
        >
          取消
        </a>
      </div>
      <HotSearchList
        ref={hotSearchRef}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <div className={styles.hotList}>
        <div className={styles.tabList}>
          {hotTagList.map((item, index) => (
            <div
              key={item}
              className={classNames(styles.tabItem, {
                [styles.active]: index === active,
              })}
              onClick={() => setActive(index)}
            >
              {item}
            </div>
          ))}
        </div>
        {active === 0 ? (
          <div className={styles.datalist}>
            {hotSearchList.map((item) => (
              <div
                key={item.id}
                className={styles.dataItem}
                onClick={() => {
                  setKeyword(item.keyword);
                  hotSearchRef.current?.onSearch?.();
                }}
              >
                <div className={styles.dataTitle}>{item.keyword}</div>
                <div className={styles.tag}>
                  {item.searchCount > 99 ? '99+' : item.searchCount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
        {active === 1 ? (
          <div className={styles.datalist}>
            {hotList.map((item) => (
              <div
                key={item.articleId}
                className={styles.dataItem}
                onClick={() => {
                  hotSearchRef.current?.onListClick?.(item);
                }}
              >
                <div className={styles.dataTitle}>{item.title}</div>
                <div className={styles.tag}>阅读量{item.readPeople}</div>
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
export default Search;
