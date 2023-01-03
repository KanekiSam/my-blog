import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}
const Button: React.FC<Props> = (props) => {
  return (
    <button {...props} className={styles.button}>
      {props.children}
    </button>
  );
};
export default Button;
