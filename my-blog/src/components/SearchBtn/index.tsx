import React, { CSSProperties, useState, useRef } from 'react';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { history, useModel } from 'umi';
import styles from './index.less';
import { Empty, Input, Popover } from 'antd';
import { httpGet } from '@/utils/request';
import { useDebounceFn, useClickAway } from '@umijs/hooks';
import HotSearchList from './hotSearchList';
import { useEffect } from 'react';

interface Props {
  style?: CSSProperties | undefined;
}
const SearchBtn: React.FC<Props> = (props) => {
  const [keyword, setKeyword] = useState('');
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const inputRef = useRef<any>(null);
  const hotSearchRef = useRef<any>(null);
  const blurEventRef = useRef<any>(null);
  const { resizeEvents } = useModel('global', (state) => ({
    resizeEvents: state.resizeEvents,
  }));

  useClickAway(
    () => {
      setShow(false);
      setVisible(false);
    },
    () => document.getElementById('input-search'),
  );
  useEffect(() => {
    resizeEvents.current['SearchBtn'] = {
      event: () => {
        setShow(false);
      },
    };
    // window.onresize = () => {
    //   setShow(false);
    // };
    return () => {
      delete resizeEvents.current['SearchBtn'];
    };
  }, []);
  return (
    <div
      style={props.style}
      className={classNames(styles.searchBtn, { [styles.showSearch]: show })}
      id="input-search"
    >
      <Popover
        content={
          <div
            className={styles.dataList}
            style={{ width: 250, minHeight: 120 }}
          >
            <HotSearchList
              keyword={keyword}
              setKeyword={setKeyword}
              ref={hotSearchRef}
              preventDefault={() => {
                if (blurEventRef.current?.inputBlurTimer) {
                  clearTimeout(blurEventRef.current.inputBlurTimer);
                }
              }}
            />
          </div>
        }
        // title="Title"
        trigger="click"
        visible={visible}
        onVisibleChange={(bool) => {
          if (keyword) {
            setVisible(bool);
          }
        }}
        getPopupContainer={() =>
          document.getElementById('input-search') || document.body
        }
      >
        <Input
          ref={inputRef}
          className={styles.input}
          style={{ border: show ? '' : 'none' }}
          value={keyword}
          onFocus={() => {
            setTimeout(() => {
              setVisible(true);
            }, 500);
          }}
          onPressEnter={() => {
            hotSearchRef.current?.onSearch?.();
          }}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (e.target.value) {
              // if (window.innerHeight > 630) {
              //   setVisible(true);
              // }
            } else {
              hotSearchRef.current?.clearInput?.();
            }
          }}
          prefix={
            <SearchOutlined
              className={styles.icon}
              onClick={() => {
                if (window.innerHeight <= 630) {
                  history.push('/search');
                } else {
                  setShow(true);
                  inputRef.current?.focus();
                }
              }}
            />
          }
          suffix={
            show ? (
              <CloseOutlined
                className={styles.close}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setKeyword('');
                  hotSearchRef.current?.clearInput?.();
                }}
              />
            ) : (
              ''
            )
          }
        />
      </Popover>
    </div>
  );
};
export default SearchBtn;
