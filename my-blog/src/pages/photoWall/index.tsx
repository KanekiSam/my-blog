import React, { useState } from 'react';
import ElasticRope, {
  IElasticRopeContent,
  ImgContentItem,
} from '@/components/ElasticRope/rope';
import { message, Modal } from 'antd';
import { useEffect } from 'react';
import styles from './index.less';

interface Props {}
const PhotoWall: React.FC<Props> = (props) => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<ImgContentItem | undefined>();
  const width = 1720;
  const height = 1500;
  useEffect(() => {
    console.log('init canvas');
    const content = [
      { type: 'text', text: '10月1号', color: 'red' },
      {
        type: 'img',
        src: require('../../static/pingtan/1.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/2.jpeg'),
        width: 150,
        height: 200,
      },
      { type: 'text', text: '平潭一日游' },
      {
        type: 'img',
        src: require('../../static/pingtan/3.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/4.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/5.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/6.jpeg'),
        width: 200,
        height: 150,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/7.jpeg'),
        width: 200,
        height: 150,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/8.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/9.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/10.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/11.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/12.jpeg'),
        width: 200,
        height: 150,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/13.jpeg'),
        width: 150,
        height: 200,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/14.jpeg'),
        width: 150,
        height: 326,
      },
      {
        type: 'img',
        src: require('../../static/pingtan/15.jpeg'),
        width: 200,
        height: 150,
      },
      { type: 'text', text: '10月7号' },
    ].map((item, i) => {
      return {
        ...item,
        key: String(i),
        onDblclick: () => {
          if (item.type === 'img') {
            setVisible(true);
            setCurrent(item as ImgContentItem);
          }
        },
      };
    }) as IElasticRopeContent[];
    const elasticRope = new ElasticRope('canvas', {
      text: {
        size: 32,
        color: 'blue',
        lineWidth: 1,
      },
      rope: {
        color: 'black',
        size: 2,
        distance: 1520,
        downRope: 100,
      },
      width,
      height,
      backSpeed: 6,
      elastic: 2.5,
      gap: 220,
      content,
      photoColumn: 7,
    });
    return () => {
      elasticRope.destory();
    };
  }, []);
  return (
    <div className={styles.wrapper} style={{ width }}>
      <div className={styles.title}>照片墙</div>
      <canvas id="canvas" width={width} height={height}></canvas>
      <Modal
        title="图片预览"
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <img src={current?.src} style={{ width: '100%' }} />
      </Modal>
    </div>
  );
};
export default PhotoWall;
