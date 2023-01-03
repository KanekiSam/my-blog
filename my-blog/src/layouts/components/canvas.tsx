import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import styles from '../index.less';

interface Props {}
const Canvas: React.FC<Props> = (props) => {
  const initStarsPopulation = 80;
  const dotsMinDist = 2;
  const maxDistFromCursor = 50;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const mouseMoving = useRef(false);
  const mousePoint = useRef<Partial<{ x: number; y: number }>>();
  const [stars, setStars] = useState<any[]>([]);
  const [dots, setDots] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrame = useRef<number>();
  const mouseMoveChecker = useRef<NodeJS.Timeout>(null);
  const onResize = () => {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    setWidth(w);
    setHeight(h);
    if (canvasRef.current) {
      canvasRef.current.width = w;
      canvasRef.current.height = h;
    }
  };
  const degToRad = (deg) => deg * (Math.PI / 180);
  const getPreviousDot = (id, stepback) => {
    if (id == 0 || id - stepback < 0) return false;
    if (typeof dots[id - stepback] != 'undefined') return dots[id - stepback];
    else return false; //getPreviousDot(id - stepback);
  };
  const getDot = (ctx: CanvasRenderingContext2D, id, x, y) => {
    const obj = {
      id,
      x,
      y,
      ctx,
      width,
      height,
      dots,
      r: Math.floor(Math.random() * 5) + 1,
      linkColor: 'rgba(255,255,255,' + 0.5 / 4 + ')',
      color: 'rgba(255,255,255,' + 0.5 + ')',
      a: 0.5,
      speed: 0.5,
      aReduction: 0.005,
      dir: Math.floor(Math.random() * 140) + 200,
      draw: () => {
        ctx.fillStyle = obj.color;
        ctx.shadowBlur = obj.r * 2;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
      },
      link: () => {
        if (obj.id == 0) return;
        var previousDot1 = getPreviousDot(obj.id, 1);
        var previousDot2 = getPreviousDot(obj.id, 2);
        var previousDot3 = getPreviousDot(obj.id, 3);
        if (!previousDot1) return;
        ctx.strokeStyle = obj.linkColor;
        ctx.moveTo(previousDot1.x, previousDot1.y);
        ctx.beginPath();
        ctx.lineTo(obj.x, obj.y);
        if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
        if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
        ctx.stroke();
        ctx.closePath();
      },
      move: () => {
        obj.a -= obj.aReduction;
        if (obj.a <= 0) {
          obj.die();
          return;
        }
        obj.color = 'rgba(255,255,255,' + obj.a + ')';
        obj.linkColor = 'rgba(255,255,255,' + obj.a / 4 + ')';
        (obj.x = obj.x + Math.cos(degToRad(obj.dir)) * obj.speed),
          (obj.y = obj.y + Math.sin(degToRad(obj.dir)) * obj.speed);

        obj.draw();
        obj.link();
      },
      die: () => {
        dots[obj.id] = null;
        delete dots[obj.id];
        setDots(dots);
      },
    };
    return obj;
  };
  const drawIfMouseMoving = (ctx: CanvasRenderingContext2D) => {
    if (!mouseMoving.current) return;
    if (!mousePoint.current) return;
    const { x: mouseX, y: mouseY } = mousePoint.current;
    if (dots.length == 0) {
      dots[0] = getDot(ctx, 0, mouseX, mouseY);
      dots[0].draw();
      return;
    }

    var previousDot = getPreviousDot(dots.length, 1);
    var prevX = previousDot.x;
    var prevY = previousDot.y;

    var diffX = Math.abs(prevX - mouseX);
    var diffY = Math.abs(prevY - mouseY);

    if (diffX < dotsMinDist || diffY < dotsMinDist) return;

    var xVariation = Math.random() > 0.5 ? -1 : 1;
    xVariation = xVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
    var yVariation = Math.random() > 0.5 ? -1 : 1;
    yVariation = yVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
    dots[dots.length] = getDot(
      ctx,
      dots.length,
      mouseX + xVariation,
      mouseY + yVariation,
    );
    dots[dots.length - 1].draw();
    dots[dots.length - 1].link();
    setDots(dots);
  };
  const animate = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);

    for (var i in stars) {
      stars[i].move();
    }
    for (var i in dots) {
      dots[i].move();
    }
    drawIfMouseMoving(ctx);
    animationFrame.current = requestAnimationFrame(function () {
      animate(ctx);
    });
  };
  const init = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'white';
    ctx.shadowColor = 'white';
    for (var i = 0; i < initStarsPopulation; i++) {
      const alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
      const obj = {
        id: i,
        a: 0.5,
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        r: Math.floor(Math.random() * 2) + 1,
        color: 'rgba(255,255,255,' + alpha + ')',
        draw: () => {
          ctx.fillStyle = obj.color;
          ctx.shadowBlur = obj.r * 2;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI, false);
          ctx.closePath();
          ctx.fill();
        },
        move: () => {
          obj.y -= 0.3;
          if (obj.y <= -10) obj.y = height + 10;
          obj.draw();
        },
        die: () => {
          stars[obj.id] = null;
          delete stars[obj.id];
          setStars(stars);
        },
      };
      stars[i] = obj;
    }
    ctx.shadowBlur = 0;
    animate(ctx);
  };
  const { resizeEvents } = useModel('global', (state) => ({
    resizeEvents: state.resizeEvents,
  }));
  useEffect(() => {
    resizeEvents.current['canvas'] = {
      event: () => {
        onResize();
      },
    };
    // window.onresize = () => {
    //   onResize();
    // };
    window.onmousemove = function (e) {
      mouseMoving.current = true;
      mousePoint.current = {
        x: e.clientX,
        y: e.clientY,
      };
      mouseMoveChecker.current && clearInterval(mouseMoveChecker.current);
      mouseMoveChecker.current = setTimeout(function () {
        mouseMoving.current = false;
      }, 100);
    };
    return () => {
      // window.onresize = () => {};
      delete resizeEvents.current['canvas'];
      window.onmousemove = () => {};
      mouseMoveChecker.current && clearInterval(mouseMoveChecker.current);
      animationFrame.current && cancelAnimationFrame(animationFrame.current);
      setDots([]);
      setStars([]);
    };
  }, []);
  let flag = false;
  return (
    <div className={styles.canvas}>
      <canvas
        width={width}
        height={height}
        ref={(dom) => {
          if (dom && !flag) {
            flag = true;
            const ctx = dom.getContext('2d');
            onResize();
            ctx && init(ctx);
            canvasRef.current = dom;
          }
        }}
        id="canvas"
      ></canvas>
      <div
        className={classNames(styles['charector-wrap'], styles.normal)}
        id="js_wrap"
      >
        <div className={styles.charector}></div>
      </div>
    </div>
  );
};
export default Canvas;
