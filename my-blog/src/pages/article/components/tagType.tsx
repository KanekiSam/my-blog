import { Input, Space, Button, message } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import _ from 'lodash';
import styles from './index.less';
import { httpGet, httpPost } from '@/utils/request';
import { useEffect } from 'react';

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}
const TagType: React.FC<Props> = (props) => {
  const { value, onChange } = props;
  const [name, setName] = useState<string>();
  const [desc, setDesc] = useState<string>();
  const [showAdd, setShowAdd] = useState(false);
  const [tagList, setTagList] = useState<
    {
      articleTypeName: string;
      articleTypeDesc: string;
      articleTypeId: string;
    }[]
  >([
    // { articleTypeName: '前端知识', articleTypeDesc: '前端知识分享' },
    // { articleTypeName: '生活日常', articleTypeDesc: '生活日常分享' },
  ]);
  const disabled = props.disabled;
  const init = () => {
    httpGet('/article/typeList').then(({ data }) => {
      setTagList(data);
    });
  };
  useEffect(() => {
    init();
  }, []);
  const onConfirm = () => {
    if (!name) {
      message.warning('请填写标签名称');
      return;
    }
    if (tagList.find((item) => item.articleTypeName === name)) {
      message.warning('标签名称重复');
      return;
    }
    const _tagList = _.cloneDeep(tagList);
    const tagObj = { articleTypeName: name, articleTypeDesc: desc };
    httpPost('/article/addType', tagObj).then(({ success, data }) => {
      if (success) {
        _tagList.push(data);

        setTagList(_tagList);
        setName(undefined);
        setDesc(undefined);
      }
    });
  };
  return (
    <div>
      <div className={styles.tagList}>
        {tagList.map((item, index) => (
          <div
            key={index}
            className={classNames(styles.tag, {
              [styles.active]: value === item.articleTypeId,
            })}
            onClick={() => {
              if (disabled) return;
              onChange?.(item.articleTypeId);
            }}
          >
            {item.articleTypeName}
          </div>
        ))}
      </div>
      {disabled ? (
        ''
      ) : (
        <Button
          onClick={() => {
            setName(undefined);
            setDesc(undefined);
            setShowAdd(true);
          }}
        >
          添加标签
        </Button>
      )}
      <div className={styles.addTag} style={{ height: showAdd ? '128px' : 0 }}>
        <Input
          placeholder="标签名称,不可重复"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
        />
        <Input.TextArea
          placeholder="标签描述，最多300字"
          value={desc}
          maxLength={300}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Space style={{ marginTop: 10 }}>
          <Button onClick={() => setShowAdd(false)}>关闭</Button>
          <Button
            type="primary"
            onClick={() => {
              onConfirm();
            }}
          >
            确定
          </Button>
        </Space>
      </div>
    </div>
  );
};
export default TagType;
