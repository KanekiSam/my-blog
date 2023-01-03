import React, { useRef, useState } from 'react';
import Calendar from '@/components/Calendar';
import styles from '../index.less';
import { PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import MusicPlayer from '@/components/MusicPlayer';
// import song1 from '../../static/mp3/Wellerman.mp3';
// import song2 from '../../static/mp3/YOASOBI-たぶん.mp3';
// import img1 from '/img/wellerman.webp';
// import img2 from '/img/大概.jpeg';
import lyrics1 from './lyrics/wellerman';
import lyrics2 from './lyrics/yasobi';

interface Props { }
const LeftSide: React.FC<Props> = (props) => {
  const [current, setCurrent] = useState(0);
  const musicRef = useRef<any>(null);
  const [songList, setSongList] = useState([
    {
      songName: 'Wellerman',
      author: 'Nathan Evans',
      isPlay: false,
      isPause: false,
      url: '/mp3/Wellerman.mp3',
      img: '/img/wellerman.webp',
      id: '0',
      lyrics: lyrics1,
    },
    {
      songName: 'YOASOBI',
      author: 'たぶん',
      isPlay: false,
      isPause: false,
      url: '/mp3/YOASOBI-たぶん.mp3',
      img: '/img/大概.jpeg',
      id: '1',
      lyrics: lyrics2,
    },
  ]);

  return (
    <div className={styles.leftSide}>
      <Calendar />
      <div className={styles.songList}>
        <div className={styles.title}>歌单列表</div>
        <div className={styles.list}>
          {songList.map((item, index) => (
            <div className={styles.songItem} key={index}>
              {index + 1}、{item.songName} -{' '}
              <span className={styles.author}>{item.author}</span>
              {item.isPlay ? (
                <PauseOutlined
                  className={styles.icon}
                  onClick={() => {
                    if (musicRef.current) {
                      musicRef.current.controlAudio('changeSong', index);
                    }
                  }}
                />
              ) : (
                <PlayCircleOutlined
                  className={styles.icon}
                  onClick={() => {
                    if (musicRef.current) {
                      musicRef.current.controlAudio('changeSong', index);
                    }
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <MusicPlayer
          songList={songList}
          setSongList={setSongList}
          current={current}
          setCurrent={setCurrent}
          ref={musicRef}
        />
      </div>
    </div>
  );
};
export default LeftSide;
