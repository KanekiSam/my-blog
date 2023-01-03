import { httpPost } from '@/utils/request';
import {
  CheckOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import { Modal, Form, Input, Button, Select, message, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import styles from '../question.less';
import AddSelect from './addSelect';

interface Props {
  visible: boolean;
  onClose: () => void;
  reload: () => void;
  categoryId?: number;
}
const AddQuestionModal: React.FC<Props> = (props) => {
  const { visible, onClose, reload, categoryId } = props;
  const [form] = Form.useForm();

  const [answer, setAnswer] = useState<number[]>([]);
  const onOk = () => {
    form.validateFields().then((values) => {
      if (categoryId) {
        httpPost('/auth/questionBank/addQuestion', {
          ...values,
          categoryId,
          answerOptions: values.answerOptions
            ? values.answerOptions
                .map((item) => item.replace(/\/\//g, ''))
                .join('//')
            : '',
          correctAnswer:
            values.questionType === 3 ? values.correctAnswer : answer.join(','),
        }).then(({ success, data }) => {
          if (success) {
            onClose();
            reload();
            // Modal.info({
            //   title: '提交成功',
            //   content: '感谢你的支持，你的创建作者已经收到，等待作者通过审核',
            // });
          }
        });
      }
    });
  };
  return (
    <Modal
      title="添加题目"
      visible={visible}
      onCancel={onClose}
      onOk={onOk}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} wrapperCol={{ span: 20 }} labelCol={{ span: 4 }}>
        <Form.Item
          label="题目内容"
          name="questionContent"
          rules={[{ required: true, message: '题目内容不能为空' }]}
        >
          <Input.TextArea autoSize={{ maxRows: 4, minRows: 4 }} />
        </Form.Item>
        <Form.Item
          label="答题类型"
          rules={[{ required: true, message: '答题类型不能为空' }]}
          name="questionType"
        >
          <Select
            placeholder="请选择"
            onChange={() => {
              setAnswer([]);
            }}
          >
            <Select.Option value={1}>单选题</Select.Option>
            <Select.Option value={2}>多选题</Select.Option>
            <Select.Option value={3}>判断题</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          shouldUpdate={(prevValues, curValues) =>
            prevValues.questionType !== curValues.questionType
          }
          noStyle
        >
          {() => {
            const values = form.getFieldsValue();
            return values.questionType ? (
              [1, 2].indexOf(Number(values.questionType)) > -1 ? (
                <Form.List name="answerOptions">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <div className={styles.questionContent}>
                          <Form.Item
                            {...(index === 0
                              ? {}
                              : { wrapperCol: { span: 20, offset: 4 } })}
                            label={index === 0 ? '答案选项' : ''}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: '选项内容不能为空',
                                },
                                {
                                  validator(rule, value, clb) {
                                    if (answer.length < 1) {
                                      clb('请点击输入框后面的符号选择正确答案');
                                    } else {
                                      clb();
                                    }
                                  },
                                },
                              ]}
                              noStyle
                            >
                              {/* <Input.TextArea
                                placeholder="选项内容"
                                style={{ width: 'calc(100% - 40px)' }}
                                autoSize={{ maxRows: 4, minRows: 4 }}
                              /> */}
                              <AddSelect />
                            </Form.Item>
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className={styles.deleteBtn}
                                onClick={() => remove(field.name)}
                              />
                            ) : null}
                          </Form.Item>
                          <Tooltip placement="top" title="点击符号选择正确选项">
                            <CheckOutlined
                              className={classNames(styles.questionCheckBtn, {
                                [styles.questionActive]:
                                  answer.indexOf(field.key) > -1,
                              })}
                              onClick={() => {
                                if (values.questionType == 1) {
                                  setAnswer([field.key]);
                                } else {
                                  const _answer = _.cloneDeep(answer);
                                  if (_answer.indexOf(field.key) > -1) {
                                    _answer.splice(
                                      _answer.indexOf(field.key),
                                      1,
                                    );
                                  } else {
                                    _answer.push(field.key);
                                  }
                                  setAnswer(_answer);
                                }
                              }}
                            />
                          </Tooltip>
                        </div>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{ width: '60%' }}
                          icon={<PlusOutlined />}
                        >
                          新增选项
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              ) : (
                <Form.Item
                  label="正确答案"
                  name="correctAnswer"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value={1}>正确</Select.Option>
                    <Select.Option value={0}>错误</Select.Option>
                  </Select>
                </Form.Item>
              )
            ) : (
              ''
            );
          }}
        </Form.Item>
        <Form.Item label="答案解析" name="answerKeys">
          <Input.TextArea autoSize={{ maxRows: 4, minRows: 4 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddQuestionModal;
