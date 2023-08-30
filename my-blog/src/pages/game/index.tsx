import React from 'react';
import styles from './index.less';
import classNames from 'classnames';

interface Props { }
const Game: React.FC<Props> = (props) => {
  return (
    <div className={styles.gameWrapper}>
      <div className={styles.title}>游戏大厅</div>
      <div className={styles.content}>
        <div className={styles.title}>PC端</div>
        <div
          className={styles.gameCard}
          onClick={() => {
            window.open('https://kanekisam.github.io/summer-juice/sunmer.html');
          }}
        >
          <div className={styles.img}>
            <img src={require('./img/清凉一夏.jpeg')} alt="" />
          </div>
          <div className={styles.gameTitle}>清凉一夏H5小游戏</div>
        </div>
        <div
          className={styles.gameCard}
          onClick={() => {
            window.open('https://kanekisam.github.io/mandown/');
          }}
        >
          <div className={styles.img}>
            <img src={require('./img/封面3.jpeg')} alt="" />
          </div>
          <div className={styles.gameTitle}>下坠</div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>H5端</div>
        <div
          className={classNames(styles.gameCard, styles.miniCard)}
          onClick={() => {
            window.open('https://kanekisam.github.io/2048/');
          }}
        >
          <div className={styles.img}>
            <img src={require('./img/2048.jpg')} alt="" />
          </div>
          <div className={styles.gameTitle}>2048</div>
        </div>
        <div
          className={classNames(styles.gameCard, styles.miniCard)}
          onClick={() => {
            window.open('https://kanekisam.github.io/2048_2/');
          }}
        >
          <div className={styles.img}>
            <img src={require('./img/2048_2.jpg')} alt="" />
          </div>
          <div className={styles.gameTitle}>新2048</div>
        </div>
      </div>
    </div>
  );
};
export default Game;
