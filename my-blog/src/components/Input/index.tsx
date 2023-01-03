import React, { useRef } from 'react';
import { useEffect } from 'react';
import styles from './index.less';

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  focus?: boolean;
}
const Input: React.FC<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (props.focus) {
      inputRef.current?.focus();
    }
  }, [props.focus]);
  return <input ref={inputRef} className={styles.input} {...props} />;
};
export default Input;
