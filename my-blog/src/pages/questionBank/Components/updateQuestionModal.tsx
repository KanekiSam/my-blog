import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Popover, message } from 'antd';
import { httpGet, httpPost } from '@/utils/request';
import styles from './index.less';
import AddQuestionModal from './addQuestionModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  reload: () => void;
  categoryId?: number;
}
const UpdateQuestionModal: React.FC<Props> = (props) => {
  const [showAddQr, setShowAddQr] = useState(false);
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [curData, setCurData] = useState({});
  const { visible, onClose, categoryId, reload } = props;
  const [form] = Form.useForm();
  const onOk = () => {
    reload();
    onClose();
  };
  const loadData = () => {
    if (!categoryId) return;
    httpGet('/auth/questionBank/getList', { categoryId }).then(
      ({ success, data }) => {
        if (success) {
          setQuestionList(data);
        }
      },
    );
  };
  const onDelete = (id) => {
    Modal.confirm({
      title: '是否确认删除这个题目？',
      onOk: () => {
        if (!id) return;

        httpPost(`/auth/questionBank/deleteQuestion?id=${id}`).then(
          ({ success, message: msg }) => {
            if (success) {
              message.info(msg);
              loadData();
            }
          },
        );
      },
    });
  };
  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [categoryId, visible]);
  return (
    <>
      <Modal
        title="修改题目"
        visible={visible}
        onCancel={onClose}
        onOk={onOk}
        okText="确定并刷新"
        cancelText="取消"
        afterClose={() => {
          form.resetFields();
        }}
        bodyStyle={{ maxHeight: 600, overflowY: 'auto' }}
        className={styles.updateQuestionModalWrapper}
      >
        <div className={styles.questionListWrapper}>
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <Button
              type="dashed"
              style={{ width: 300 }}
              onClick={() => {
                setShowAddQr(true);
                setCurData({});
              }}
            >
              添加
            </Button>
          </div>
          {questionList.map((item, index) => {
            return (
              <div key={index} className={styles.questionListItem}>
                <div className={styles.text}>
                  <span className={styles.no}>{index + 1}、</span>
                  <Popover
                    placement="top"
                    content={
                      <div style={{ width: 300, wordBreak: 'break-all' }}>
                        {item.questionContent}
                      </div>
                    }
                    trigger="click"
                  >
                    <span className={styles.title}>{item.questionContent}</span>
                  </Popover>
                </div>
                <div className={styles.actions}>
                  <Button
                    onClick={() => {
                      setShowAddQr(true);
                      setCurData({ ...item });
                    }}
                  >
                    修改
                  </Button>
                  <Button onClick={() => onDelete(item.questionId)}>
                    删除
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <AddQuestionModal
        visible={showAddQr}
        categoryId={categoryId}
        onClose={() => {
          setShowAddQr(false);
        }}
        initData={curData}
        reload={() => {
          loadData();
          // reload();
        }}
      />
    </>
  );
};
export default UpdateQuestionModal;
