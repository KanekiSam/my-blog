import { httpGet, httpPost } from '@/utils/request';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Empty, Button, Space, message, Modal } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { history, useModel } from 'umi';
import { useEffect } from 'react';
import { useState } from 'react';
import AddBankModal from './Components/addBankModal';
import AddQuestionModal from './Components/addQuestionModal';
import styles from './question.less';
import UpdateQuestionModal from './Components/updateQuestionModal';

interface Props {}
const Question: React.FC<Props> = (props) => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [showAddQr, setShowAddQr] = useState(false);
  const [showUpdateQr, setShowUpdateQr] = useState(false);
  const [current, setCurrent] = useState<number>();
  const { isLogin } = useModel('global', (model) => ({
    isLogin: model.isLogin,
  }));
  const queryList = () => {
    httpGet('/auth/questionBank/getCategory').then(({ success, data }) => {
      if (success && typeof data === 'object') {
        setDataList(data);
      }
    });
  };
  const onDelete = (id) => {
    Modal.confirm({
      title: '是否删除当前题库？',
      onOk: () => {
        if (!id) return;
        httpPost(`/auth/questionBank/deleteCategory?id=${id}`).then(
          ({ success, message: msg }) => {
            if (success) {
              message.info(msg);
              queryList();
            }
          },
        );
      },
    });
  };
  useEffect(() => {
    queryList();
  }, []);
  return (
    <div className={styles.questionWrapper}>
      <div className={classNames(styles.cardWrapper, styles.statics)}>
        <span className={styles.staticItem}>
          总题库<span>{dataList.length}</span>
        </span>
        {isLogin ? (
          <a onClick={() => setVisible(true)}>
            <PlusOutlined />
            新增题库
          </a>
        ) : (
          ''
        )}
      </div>
      <div className={styles.cardWrapper}>
        <div className={styles.dataList}>
          {dataList.length ? (
            dataList.map((item, index) => (
              <div
                className={styles.dataItem}
                key={item.categoryId}
                onClick={() => {}}
              >
                <div className={styles.flexWrapper}>
                  <div className={styles.poster}>
                    <img src={item.posterUrl} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.title}>{item.categoryName}</div>
                    <div className={styles.count}>
                      题库数目：
                      <span className={styles.num}>
                        {item.questionBanks.length}
                      </span>
                    </div>
                  </div>
                </div>
                <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    disabled={item.questionBanks.length < 1}
                    onClick={() => {
                      history.push({
                        pathname: '/question/bank',
                        query: { id: item.categoryId },
                      });
                    }}
                  >
                    开始答题
                  </Button>
                  {isLogin ? (
                    <Button
                      onClick={() => {
                        setShowUpdateQr(true);
                        setCurrent(item.categoryId);
                      }}
                    >
                      {item.questionBanks.length < 1 ? '添加' : '修改'}题库
                    </Button>
                  ) : (
                    ''
                  )}
                </Space>
                <div
                  style={{ margin: '4px 0', fontSize: 12, textAlign: 'right' }}
                >
                  答题人数：
                  <span className="text-red">{item.participationNum}</span>{' '}
                  答题准确率：
                  <span className="text-red"> {item.averageRate}</span>
                </div>
                {isLogin ? (
                  <div
                    className={styles.deleteBtn}
                    onClick={() => onDelete(item.categoryId)}
                  >
                    <DeleteOutlined />
                  </div>
                ) : (
                  ''
                )}
              </div>
            ))
          ) : (
            <Empty
              description={
                <div>
                  <div>作者太懒了，没有任何题库</div>
                  <Button
                    style={{ marginTop: 20 }}
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    新增题库
                  </Button>
                </div>
              }
            />
          )}
        </div>
      </div>
      <AddBankModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        reload={() => {
          queryList();
        }}
      />
      <AddQuestionModal
        visible={showAddQr}
        categoryId={current}
        onClose={() => setShowAddQr(false)}
        reload={() => {
          queryList();
        }}
      />
      <UpdateQuestionModal
        visible={showUpdateQr}
        categoryId={current}
        onClose={() => setShowUpdateQr(false)}
        reload={() => {
          queryList();
        }}
      />
    </div>
  );
};
export default Question;
