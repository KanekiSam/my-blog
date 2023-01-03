import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Progress } from 'antd';
import classNames from 'classnames';
import {
  BackwardOutlined,
  ForwardOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  RedoOutlined,
  RetweetOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
// import ReactAudioPlayer from 'react-audio-player';
import styles from './index.less';

interface Props {
  songList: any[];
  setSongList: Function;
  current: number;
  setCurrent: Function;
  ref: any;
}
const MusicPlayer: React.FC<Props> = forwardRef((props, ref) => {
  const [cycleType, setCycleType] = useState(0); // 0列表循环，1单曲循环
  const [startTime, setStartTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const [muted, setMuted] = useState(false); // 是否静音
  const [percent, setPercent] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [curWord, setCurWord] = useState(-1);
  const { songList, setSongList, current, setCurrent } = props;
  const audioRef = useRef<HTMLAudioElement>(null);
  const onceRef = useRef(false);
  const once2Ref = useRef(false);
  const playStateRef = useRef({ playing: () => { }, cancel: () => { } });
  const playState2Ref = useRef({ playing: () => { }, cancel: () => { } });
  useImperativeHandle(ref, () => ({
    controlAudio,
  }));
  const onCircleClick = () => {
    setCycleType(cycleType == 0 ? 1 : 0);
  };
  const countPercent = () => {
    if (!audioRef.current) return 0;
    return Math.floor(
      (audioRef.current.currentTime * 100) / audioRef.current.duration,
    );
  };
  const controlAudio = (
    type:
      | 'play'
      | 'pause'
      | 'muted'
      | 'changeCurrentTime'
      | 'changeVolume'
      | 'next'
      | 'prev'
      | 'changeSong',
    value?: number,
  ) => {
    if (!audioRef.current) return;
    switch (type) {
      case 'play': {
        audioRef.current.play();
        if (!songList[current].isPlay) {
          setSongList(
            songList.map((item, index) => {
              if (index == current) {
                item.isPlay = true;
                item.isPause = false;
              } else {
                item.isPlay = false;
              }
              return item;
            }),
          );
          const childs = document.getElementById('lyrics')?.children || [];
          [...childs].forEach((ele) => {
            if (ele.localName == 'div' && !ele.className.includes('running')) {
              ele.className = ele.className.replace('paused', '') + ' running';
            }
          });
          playStateRef.current.playing();
          playState2Ref.current.playing();
        }
        break;
      }
      case 'pause': {
        audioRef.current.pause();
        if (songList[current].isPlay) {
          setSongList(
            songList.map((item, index) => {
              if (index == current) {
                item.isPlay = false;
                item.isPause = true;
              } else {
                item.isPause = false;
              }
              return item;
            }),
          );
          const childs = document.getElementById('lyrics')?.children || [];
          [...childs].forEach((ele) => {
            if (ele.localName == 'div' && !ele.className.includes('paused')) {
              ele.className = ele.className.replace('running', '') + ' paused';
            }
          });
          playStateRef.current.cancel();
          playState2Ref.current.cancel();
        }
        break;
      }
      case 'muted': {
        audioRef.current.muted = !muted;
        setMuted(!muted);
        setVolume(0);
        break;
      }
      case 'changeCurrentTime': {
        if (typeof value == 'number') {
          setStartTime(countTime(value));
          audioRef.current.currentTime = value;
          setPercent(countPercent());
        }
        break;
      }
      case 'changeVolume': {
        if (typeof value == 'number') {
          audioRef.current.volume = value;
          setVolume(value);
          setMuted(value == 0);
        }
        break;
      }
      case 'next': {
        const next = current + 1 < songList.length ? current + 1 : 0;
        setCurrent(next);
        setSongList(
          songList.map((item, index) => {
            item.isPause = false;
            if (index == next) {
              item.isPlay = true;
            } else {
              item.isPlay = false;
            }
            return item;
          }),
        );
        setPercent(0);
        setStartTime('00:00');
        setTotalTime('00:00');
        audioRef.current.oncanplay = () => {
          audioRef.current && audioRef.current.play();
        };
        break;
      }
      case 'prev': {
        const prev = current - 1 >= 0 ? current - 1 : songList.length - 1;
        setCurrent(prev);
        setSongList(
          songList.map((item, index) => {
            item.isPause = false;
            if (index == prev) {
              item.isPlay = true;
            } else {
              item.isPlay = false;
            }
            return item;
          }),
        );
        setPercent(0);
        setStartTime('00:00');
        setTotalTime('00:00');
        audioRef.current.oncanplay = () => {
          audioRef.current && audioRef.current.play();
        };
        break;
      }
      case 'changeSong': {
        if (typeof value == 'number') {
          console.log(songList[value]);
          if (!songList[value].isPlay && !songList[value].isPause) {
            setCurrent(value);
            setSongList(
              songList.map((item, index) => {
                if (index == value) {
                  item.isPlay = true;
                } else {
                  item.isPlay = false;
                }
                return item;
              }),
            );
            setPercent(0);
            setStartTime('00:00');
            setTotalTime('00:00');
            audioRef.current.oncanplay = () => {
              audioRef.current && audioRef.current.play();
            };
          } else {
            if (!songList[value].isPlay) {
              controlAudio('play');
            } else {
              controlAudio('pause');
            }
          }
        }
        break;
      }
    }
  };
  const countTime = (time?: string | number) => {
    if (!time) {
      return '00:00';
    }
    const t = Math.floor(+time);
    const m = Math.floor(t / 60);
    const s = t % 60;
    const M = (m + '').length == 2 ? m : '0' + m;
    const S = (s + '').length == 2 ? s : '0' + s;
    return M + ':' + S;
  };
  const curSong = songList[current];
  const getCurWord = () => {
    if (!audioRef.current) return;
    const curTime = audioRef.current.currentTime;
    const { lyrics } = curSong;
    const index = lyrics.findIndex((item: any, i: number) => {
      return (
        +item.t <= curTime &&
        (i == lyrics.length - 1 || curTime < +lyrics[i + 1].t)
      );
    });
    if (index != curWord) {
      setCurWord(index);
      onceRef.current = false;
      once2Ref.current = false;
    }
  };
  let offsetTime = 1;
  if (curWord != -1 && curWord < curSong.lyrics.length - 1) {
    offsetTime = curSong.lyrics[curWord + 1].t - curSong.lyrics[curWord].t;
    // offsetTime = t < 1 ? t : 1;
  }
  const setDomAnimation = (dom: HTMLDivElement | null, type: 0 | 1,) => {
    const curref = type == 0 ? onceRef : once2Ref;
    if (dom && !curref.current) {
      curref.current = true;
      const width = dom.clientWidth;
      const lyricsDom = document.getElementById('lyrics');
      const wrapper = lyricsDom?.clientWidth ?? 0;
      if (width > wrapper) {
        const t1 = Number(
          (((width - wrapper) * offsetTime) / width).toFixed(1),
        );
        let time = offsetTime - t1;
        time = time - 1 < 0 ? 0 : time - 1;
        dom.style.setProperty('--offset', wrapper - width + 'px');
        dom.style.setProperty('--time0', offsetTime + 's');
        dom.style.setProperty('--time', t1 + 's');
        // dom.style.setProperty('--delay', offsetTime - t1 + 's');
        dom.style.setProperty('--delay', time + 's');
        setTimeout(() => {
          if (!dom.className.includes(styles.animate)) {
            dom.className = dom.className + ' ' + styles.animate;
          }
        }, 10);
      }
    }
  }
  return (
    <div className={styles.songingWraper}>
      <div className={styles.songInfo}>
        <div className={styles.poster}>
          <img src={curSong.img} alt="" />
        </div>
        <div className={styles.textInfo}>
          <div className={styles.songName}>
            {curSong.songName} -{' '}
            <span className={styles.author}>{curSong.author}</span>
          </div>
          <div className={styles.lyrics} id="lyrics">
            {curWord != -1 && curSong.lyrics[curWord] && (
              <div
                className={styles.word}
                key={curWord + 'ol'}
                style={{ animationDuration: offsetTime + 's' }}
                ref={(dom) => setDomAnimation(dom, 0)}
              >
                {curWord != -1 && curSong.lyrics[curWord].w}
              </div>
            )}
            <br />
            {curWord != -1 && curSong.lyrics[curWord] && (
              <div
                className={styles.word}
                key={curWord}
                style={{ animationDuration: offsetTime + 's' }}
                ref={(dom) => setDomAnimation(dom, 1)}
              >
                {curWord != -1 && curSong.lyrics[curWord].c}
              </div>
            )}
          </div>
        </div>
      </div>
      <audio
        id={curSong.id}
        src={curSong.url}
        preload="true"
        loop={cycleType == 1}
        autoPlay={false}
        onCanPlay={() => {
          if (audioRef.current) {
            controlAudio('changeVolume', volume);
            setTotalTime(countTime(audioRef.current.duration));
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setStartTime(countTime(audioRef.current.currentTime));
            setPercent(countPercent());
            getCurWord();
            if (audioRef.current.currentTime == audioRef.current.duration) {
              if (cycleType == 1) {
                controlAudio('changeCurrentTime', 0);
              } else {
                controlAudio('next');
              }
            }
          }
        }}
        ref={audioRef}
      >
        您的浏览器不支持 audio 标签。
      </audio>
      <div
        ref={(dom) => {
          dom?.addEventListener('click', (e) => {
            console.log(e.offsetX);
            if (audioRef.current) {
              const offsetX = e.offsetX > 210 ? 210 : e.offsetX;
              controlAudio(
                'changeCurrentTime',
                (offsetX / 210) * audioRef.current.duration,
              );
            }
          });
        }}
      >
        <Progress percent={percent} showInfo={false} size="small" />
      </div>

      <div className={styles.timer}>
        <span>{startTime}</span>
        <span>{totalTime}</span>
      </div>
      <div className={styles.tool}>
        <div className={styles.voiceIcon}>
          <SoundOutlined
            className={classNames(styles.toolIcon, {
              [styles.unvoice]: muted,
            })}
            onClick={() => {
              if (volume == 1) {
                controlAudio('muted');
              } else {
                controlAudio('changeVolume', volume + 0.2);
              }
            }}
          ></SoundOutlined>
          <div
            className={styles.volumeWrapper}
            ref={(dom) => {
              dom?.addEventListener('click', (e) => {
                const offsetX = e.offsetX > 60 ? 60 : e.offsetX;
                controlAudio('changeVolume', offsetX / 60);
              });
            }}
          >
            <Progress percent={volume * 100} size="small" showInfo={false} />
          </div>
        </div>

        <BackwardOutlined
          className={classNames(styles.toolIcon)}
          onClick={() => controlAudio('prev')}
        />
        {curSong.isPlay ? (
          <PauseOutlined
            className={classNames(styles.toolIcon, styles.playBtn)}
            onClick={() => {
              controlAudio('pause');
            }}
          />
        ) : (
          <PlayCircleOutlined
            className={classNames(styles.toolIcon, styles.playBtn)}
            onClick={() => {
              controlAudio('play');
            }}
          />
        )}
        <ForwardOutlined
          className={classNames(styles.toolIcon)}
          onClick={() => controlAudio('next')}
        />
        <RetweetOutlined
          className={classNames(styles.toolIcon, {
            [styles.singleCircle]: cycleType == 1,
          })}
          title={cycleType == 1 ? '单曲循环' : '列表循环'}
          onClick={onCircleClick}
        />
      </div>
      {/* <ReactAudioPlayer src={curSong.url} autoPlay controls /> */}
    </div>
  );
});
export default MusicPlayer;
