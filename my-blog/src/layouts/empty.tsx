import React, { useEffect } from 'react';
import { TokenUtils } from '@/utils/token';

interface Props { }
const index: React.FC<Props> = (props) => {
  const theme = TokenUtils.getTheme();
  useEffect(() => {
    document.body.setAttribute('class', `bigB-${theme || 'custom'}-theme`);
  }, [theme]);
  return <div>{props.children}</div>;
};
export default index;
