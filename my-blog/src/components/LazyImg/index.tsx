import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

interface Props extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
}
const LazyImg: React.FC<Props> = (props) => {
  const { src, ...rest } = props;
  const [loading, setLoading] = useState(true);
  return (
    <Spin spinning={loading}>
      <img
        alt="图片加载失败"
        {...props}
        loading="lazy"
        onLoadStart={() => {
          setLoading(true)
        }}
        onLoad={() => {
          setLoading(false)
        }}
      />
    </Spin>
  );
}
export default LazyImg;
