import _ from 'lodash';
import classNames from 'classnames';
import React from 'react';
import { ImageListItem } from '../addArticle';
import styles from './index.less';
import { Button, message, Upload } from 'antd';

interface Props {
  dataList: ImageListItem[];
  value?: string[];
  onChange?: (v: string[]) => void;
  uploadFunc: (file: File) => void;
}
const ImageList: React.FC<Props> = (props) => {
  const max = 3;
  const { value } = props;
  const beforeUpload = (file: File) => {
    props.uploadFunc(file);
    return false;
  };
  return (
    <div>
      <div className={styles.imageList}>
        {props.dataList.map((item, index) => {
          const vIndex = value ? value.indexOf(item.url) : -1;
          const active = vIndex > -1;
          return (
            <div
              key={index}
              className={classNames(styles.imageItem, {
                [styles.active]: active,
              })}
              onClick={() => {
                if (!active) {
                  if (value && value.length >= max) {
                    message.warning(`最多只能选择${max}张图片`);
                    return;
                  }
                }
                const _value = value ? _.cloneDeep(value) : [];
                if (active) {
                  _value.splice(vIndex, 1);
                } else {
                  _value.push(item.url);
                }
                props.onChange?.(_value);
              }}
            >
              <img src={item.url} />
            </div>
          );
        })}
      </div>
      <Upload
        accept="jpg,png,jpeg"
        beforeUpload={beforeUpload}
        showUploadList={false}
      >
        <Button>上传图片</Button>
      </Upload>
    </div>
  );
};
export default ImageList;
