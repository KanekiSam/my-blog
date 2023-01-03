import _ from 'lodash';
interface RopeConfig {
  distance?: number;
  color?: string;
  downRope?: number;
  size?: number;
  marginTop?: number;
}
interface TextConfig {
  color?: string;
  size?: number;
  lineWidth?: number;
}
interface PhotoConfig {
  width?: number;
  height?: number;
}
interface TextContentItem extends Partial<TextConfig> {
  type: 'text';
  text: string;
  onDblclick?: () => void;
  key: string;
}
export interface ImgContentItem {
  type: 'img';
  src: string;
  img?: HTMLImageElement;
  width?: number;
  height?: number;
  onDblclick?: () => void;
  key: string;
}
interface NodePoint {
  startPoint: Point;
  endPoint: Point;
  type: string;
  direction: 'left' | 'right';
  deg: number;
  shake: boolean;
  content: TextContentItem | ImgContentItem;
  row: number;
  rowIndex: number;
  key: number;
}
export type IElasticRopeContent = TextContentItem | ImgContentItem;
export interface Ioptions {
  width?: number;
  height?: number;
  backSpeed?: number;
  elastic?: number;
  rope?: RopeConfig;
  text?: TextConfig;
  photo?: PhotoConfig;
  content: IElasticRopeContent[];
  gap?: number;
  photoColumn?: number;
}
interface Point {
  x: number;
  y: number;
}
const defaultConfig = {
  width: 500,
  height: 300,
  backSpeed: 1.2,
  elastic: 3,
  rope: {
    distance: 300,
    color: '#000',
    downRope: 30,
    size: 2,
    marginTop: 0,
  },
  text: { color: '#000', size: 26, lineWidth: 1 },
  gap: 60,
  photo: { width: 150, height: 100 },
  photoColumn: 6,
};
interface RopePoints {
  start: Point;
  end: Point;
  control: Point;
}
export default class ElasticRope {
  id: string;
  options: Required<Ioptions>;
  rope: Required<RopeConfig>;
  text: Required<TextConfig>;
  photo: Required<PhotoConfig>;
  speed: number;
  cvs?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D | null;
  rope_points?: RopePoints[];
  rope_ol_points?: RopePoints[];
  // rope_starpoint?: Point;
  // rope_endpoint?: Point;
  // rope_control?: Point;
  // init_rope_Control?: Point;
  nodePoint: NodePoint[];
  olNodePoint: NodePoint[];
  springbackTimer?: NodeJS.Timer;
  timer?: NodeJS.Timer;
  clickTimer?: NodeJS.Timer;
  clickNum: number = 0;
  current?: IElasticRopeContent;
  row: number = 1;
  constructor(id: string, options: Ioptions) {
    const _options = Object.assign({}, defaultConfig, options);
    this.id = id;
    this.rope = _options.rope;
    this.text = _options.text;
    this.photo = _options.photo;
    this.options = _options;
    this.speed = Math.PI / 80;
    this.nodePoint = [];
    this.olNodePoint = [];
    this.initCanvas();
    this.initRope();
    this.initContent();
    this.initEvent();
    this.update();
  }
  initCanvas() {
    this.cvs = document.getElementById(this.id) as HTMLCanvasElement;
    this.ctx = this.cvs.getContext('2d');
    if (this.cvs) {
      this.cvs.width = this.options.width;
      this.cvs.height = this.options.height;
    } else {
      throw console.error('画布创建失败');
    }
  }
  initRope() {
    const rowNum = Math.ceil(
      this.options.content.length / this.options.photoColumn,
    );
    const oneHeight = this.options.height / rowNum;
    const rope_width = this.rope.distance;
    const { width, height } = this.options;
    const { marginTop } = this.rope;
    const rope_starpoint = {
      x: (width - rope_width) / 2,
      y: 80,
    };
    const rope_endpoint = {
      x: width - rope_starpoint.x,
      y: rope_starpoint.y,
    };
    const rope_control = {
      x: width / 2,
      y: 260,
    };
    this.row = rowNum;
    const ropePoints: RopePoints[] = [];
    for (let i = 0; i < rowNum; i++) {
      const y = rope_starpoint.y + oneHeight * i;
      ropePoints.push({
        start: { x: rope_starpoint.x, y },
        end: { x: rope_endpoint.x, y },
        control: {
          x: rope_control.x,
          y: rope_control.y + oneHeight * i,
        },
      });
    }
    this.rope_points = ropePoints;
    this.rope_ol_points = _.cloneDeep(ropePoints);
    this.drawRope();
  }
  /**
   *
   * @param t 位置比例，x/distance
   * @param row 行数
   * @returns 点位置
   */
  // 贝塞尔曲线上点获取
  getPoint(t: number, row: number) {
    const ropeOne = this.rope_points?.[row - 1];
    const begin = ropeOne?.start;
    const end = ropeOne?.end;
    const control = ropeOne?.control;
    if (!begin || !control || !end) return;
    let x =
      Math.pow(1 - t, 2) * begin.x +
      2 * t * (1 - t) * control.x +
      Math.pow(t, 2) * end.x;
    let y =
      Math.pow(1 - t, 2) * begin.y +
      2 * t * (1 - t) * control.y +
      Math.pow(t, 2) * end.y;
    return { x, y };
  }
  /**
   *
   * @param row 行数
   * @param i 行中的索引位置
   * @returns
   */
  getItemPoint(item: { rowIndex: number; row: number }) {
    let gap;
    let start = 0;
    if (
      this.options.gap * (this.options.photoColumn - 1) <=
      this.rope.distance
    ) {
      gap = this.options.gap;
      start =
        (this.rope.distance -
          this.options.gap * (this.options.photoColumn - 1)) /
        2;
    } else {
      gap = this.rope.distance / (this.options.photoColumn - 1);
    }
    return this.getPoint(
      (start + gap * item.rowIndex) / this.rope.distance,
      item.row,
    );
  }
  getItemGap() {
    const { gap, content } = this.options;
    const length = content.length;
    const rope_width = this.rope.distance;
    const itemgap =
      (length - 1) * gap > rope_width ? rope_width / (length - 1) : gap;
    return itemgap;
  }
  initContent() {
    const { content } = this.options;
    const length = content.length;
    const nodePoints = [];
    for (let row = 1; row <= this.row; row++) {
      for (let i = 0; i < this.options.photoColumn; i++) {
        const index = i + (row - 1) * this.options.photoColumn;
        const contentItem = content[index];
        if (contentItem) {
          let point = this.getItemPoint({ rowIndex: i, row });
          if (point) {
            const endX = point.x;
            const endY = point.y + this.rope.downRope;
            const item: NodePoint = {
              row,
              rowIndex: i,
              key: index,
              startPoint: point,
              endPoint: { x: endX, y: endY },
              type: contentItem.type,
              direction: 'left',
              deg: Math.PI / 2,
              shake: true,
              content: contentItem,
            };
            nodePoints[index] = item;
            this.drawItem(item, index);
          }
        }
      }
    }
    console.log(nodePoints);
    this.nodePoint = nodePoints;
    this.olNodePoint = nodePoints;
  }
  colorRgb(str: string, opacity: number) {
    var sColor = str.toLowerCase();
    if (sColor) {
      if (sColor.length === 4) {
        var sColorNew = '#';
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      // 处理六位的颜色值
      var sColorChange = [];
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
      }
      return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')';
    } else {
      return sColor;
    }
  }
  drawRope() {
    // const startPoint = this.rope_starpoint;
    // const endPoint = this.rope_endpoint;
    // const control = this.rope_control;
    this.rope_points?.forEach((item) => {
      if (!this.ctx || !item) return;
      this.ctx.lineWidth = this.rope.size;
      const { color } = this.rope;
      var gnt1 = this.ctx.createLinearGradient(
        item.start.x,
        item.start.y,
        item.end.x,
        item.end.y,
      ); // 线性渐变的起止坐标
      gnt1.addColorStop(0, color); //创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
      gnt1.addColorStop(1, 'gray');
      this.ctx.strokeStyle = gnt1;
      this.ctx.beginPath();
      this.ctx.moveTo(item.start.x, item.start.y);
      this.ctx.quadraticCurveTo(
        item.control.x,
        item.control.y,
        item.end.x,
        item.end.y,
      );
      // const { start, end } = item;
      // const grd = this.ctx.createLinearGradient(start.x, start.y, end.x, end.y); // 线性渐变的起止坐标
      // const colors = ['red', 'yellow', 'green', 'orange'];
      // for (var i = 0; i <5; i++) {
      //   grd.addColorStop(i / 5, colors[i]);
      //   this.ctx.stroke();
      // }
      // this.ctx.strokeStyle = grd;
      this.ctx.stroke();
    });
  }
  /**
   *
   * @param point 点
   * @param i 挂绳索引位置
   * @returns
   */
  drawItem(point: NodePoint, i: number) {
    if (!this.ctx) return;
    const starX = point.startPoint.x;
    const starY = point.startPoint.y;
    const endX = point.endPoint.x;
    const endY = point.endPoint.y;
    const color = this.text.color;
    this.ctx.strokeStyle = this.rope.color;
    this.ctx.lineWidth = this.rope.size;
    this.ctx.moveTo(starX, starY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
    if (point.content.type === 'text') {
      const font = this.getEdgePoint(point.endPoint, point.content);
      const size = this.text.size;
      this.ctx.lineWidth = point.content.lineWidth || this.text.lineWidth;
      this.ctx.font = (point.content.size || size) + 'px bold ' + color;
      this.ctx.fillStyle = point.content.color || color;
      // this.ctx.strokeText(point.content.text, font.x, font.y);
      // this.ctx.fillText(point.content.text, font.x - 2, font.y - 2);
      this.ctx.fillText(point.content.text, font.x, font.y);
    } else {
      let img = point.content.img;
      const width = point.content.width || this.photo.width;
      const height = point.content.height || this.photo.height;
      if (img?.complete) {
        // 将图片画到canvas上面上去！
        this.ctx.drawImage(img, endX - width / 2, endY, width, height);
      } else {
        img = new Image();
        img.onload = () => {
          // alert('加载完毕');

          // 将图片画到canvas上面上去！
          if (this.ctx && img) {
            this.ctx.drawImage(img, endX - width / 2, endY, width, height);
          }
          const content = this.nodePoint[i].content;
          if (content.type === 'img') {
            content.img = img;
          }
        };
        img.src = point.content.src;
      }
    }
  }
  getEdgePoint(endPoint: Point, item: TextContentItem | ImgContentItem) {
    let startX;
    let startY;
    let x0;
    let y0;
    let x1;
    let y1;
    if (item.type === 'text') {
      const size = item.size || this.text.size;
      const width = item.text.length * size;
      startX = endPoint.x - width / 2;
      startY = endPoint.y + size;
      x0 = startX;
      y0 = endPoint.y - size;
      x1 = startX + width;
      y1 = startY;
    } else {
      const width = item.width || this.photo.width;
      const height = item.height || this.photo.height;
      startX = endPoint.x - width / 2;
      startY = endPoint.y;
      x0 = startX;
      y0 = startY;
      x1 = startX + width;
      y1 = startY + height;
    }
    return {
      x: startX,
      y: startY,
      x0,
      y0,
      x1,
      y1,
    };
  }
  getSwingPointBydeg(point: Point, deg: number) {
    let endX, endY;
    const { downRope } = this.rope;
    endY = point.y + downRope * Math.sin(deg);
    endX = point.x - downRope * Math.cos(deg);
    return { x: endX, y: endY };
  }
  getAngle(startPoint: Point, movePoint: Point) {
    const x = movePoint.x - startPoint.x;
    const y = movePoint.y - startPoint.y;
    const deg = Math.PI - Math.atan2(y, x);
    return deg;
  }
  roopRunner() {
    const target = this.nodePoint.find((item) => !item.shake);
    if (!target) return;
    const deg = target.deg;
    let direction: string; //  "positive"|"negative";
    if (deg < (Math.PI * 3) / 4 && deg > Math.PI / 2) {
      direction = 'negative';
    } else {
      direction = 'positive';
    }
    let diffDeg = (Math.PI * 2) / 50;
    const roopTimer = setInterval(() => {
      this.nodePoint.forEach((item, i) => {
        if (item.shake) return;
        const point = item.startPoint;
        if (direction == 'negative') {
          item.deg -= diffDeg;
        } else {
          item.deg += diffDeg;
        }
        item.endPoint = this.getSwingPointBydeg(point, item.deg);
      });
    }, 10);
    setTimeout(() => {
      console.log('stopRoop');
      clearInterval(roopTimer);
      this.nodePoint.forEach((item, i) => {
        item.shake = true;
        item.deg = Math.PI / 2;
      });
    }, 500);
  }
  dblclickEvent() {
    if (!this.cvs) return;
    this.cvs.addEventListener('dblclick', (e) => {
      if (this.clickTimer) {
        clearTimeout(this.clickTimer);
      }
      this.current?.onDblclick?.();
      this.nodePoint.forEach((item) => {
        if (item.content.key === this.current?.key) {
          item.shake = true;
        }
      });
    });
  }
  getRow(i: number) {
    const { photoColumn } = this.options;
    const row = Math.ceil(i / photoColumn);
    return row;
  }
  initEvent() {
    this.dblclickEvent();
    if (!this.cvs) return;
    this.cvs.addEventListener('mousedown', (e) => {
      if (this.clickTimer) {
        clearTimeout(this.clickTimer);
      }
      if (this.springbackTimer) {
        clearInterval(this.springbackTimer);
      }
      document.onmousemove = (e) => {};
      document.onmouseup = (e) => {};
      if (!this.cvs) return;
      const clickEvent: any = e;
      let mwidth =
        clickEvent.clientX - this.cvs.offsetLeft + document.body.scrollLeft;
      let mheight =
        clickEvent.clientY - this.cvs.offsetTop + document.body.scrollTop;
      this.nodePoint.forEach((item, i) => {
        const edge = this.getEdgePoint(item.endPoint, item.content);
        console.log(edge);
        console.log(mwidth, mheight);
        console.log(
          mwidth >= edge.x0 && mwidth <= edge.x1,
          mheight >= edge.y0 && mheight <= edge.y1,
        );
        if (
          mwidth >= edge.x0 &&
          mwidth <= edge.x1 &&
          mheight >= edge.y0 &&
          mheight <= edge.y1
        ) {
          console.log('shake');
          item.shake = false;
          this.current = item.content;
          this.clickNum += 1;
        } else {
          item.shake = true;
        }
      });
      this.clickTimer = setTimeout(() => {
        const target = this.nodePoint.find((item) => !item.shake);
        console.log(target);
        if (target) {
          const row = target.row - 1;
          const ropeOne = this.rope_points?.[row];
          const olRopeOne = this.rope_ol_points?.[row];
          if (!ropeOne || !olRopeOne) return;
          const controlX = ropeOne.control.x;
          const controlY = ropeOne.control.y;
          document.onmousemove = (e) => {
            const clickEvent2: any = e;
            if (!this.cvs || !this.ctx) return;
            let mwidth2 =
              clickEvent2.clientX - this.cvs.offsetLeft + window.scrollX;
            let mheight2 =
              clickEvent2.clientY - this.cvs.offsetTop + window.scrollY;
            let diffX = mwidth2 - mwidth;
            let diffY = mheight2 - mheight;
            this.ctx.clearRect(0, 0, this.options.width, this.options.height);
            ropeOne.control = {
              x: controlX + diffX,
              y: controlY + diffY,
            };
            this.drawRope();
            this.nodePoint.forEach((point, i) => {
              const item = this.olNodePoint[i];
              const startPoint = this.getItemPoint({
                rowIndex: item.rowIndex,
                row: item.row,
              });
              if (startPoint) {
                point.startPoint = startPoint;
              }
              if (!point.shake) {
                const deg = this.getAngle(point.startPoint, {
                  x: mwidth2,
                  y: mheight2,
                });
                point.deg = deg;
                point.endPoint = this.getSwingPointBydeg(point.startPoint, deg);
                console.log('current:', (180 * deg) / Math.PI);
              } else {
                point.endPoint = this.getSwingPointBydeg(
                  point.startPoint,
                  point.deg,
                );
              }
              this.drawItem(point, i);
            });
            document.onmouseup = (e) => {
              document.onmousemove = (e) => {};
              document.onmouseup = (e) => {};
              this.roopRunner();
              const control = ropeOne.control;
              if (!control) return;
              let initControlX = control.x;
              let initControlY = control.y;
              let direction = { verticle: '', herit: '' };
              const checkControl = () => {
                const diffx = initControlX - olRopeOne.control.x;
                const diffy = initControlY - olRopeOne.control.y;
                const speed = this.options.elastic;
                initControlX =
                  diffx / speed <= 1
                    ? olRopeOne.control.x
                    : initControlX - diffx / speed;
                initControlY =
                  diffy / speed <= 1
                    ? olRopeOne.control.y
                    : initControlY - diffy / speed;
              };
              this.springbackTimer = setInterval(() => {
                if (control.x > initControlX) {
                  if (direction.verticle != 'left') {
                    direction.verticle = 'left';
                    checkControl();
                  }
                }
                if (control.x < this.options.width - initControlX) {
                  if (direction.verticle != 'right') {
                    direction.verticle = 'right';
                    checkControl();
                  }
                }
                if (control.y > initControlY) {
                  if (direction.herit != 'top') {
                    direction.herit = 'top';
                    checkControl();
                  }
                }
                if (control.y < this.options.height - initControlY) {
                  if (direction.herit != 'bottom') {
                    direction.herit = 'bottom';
                    checkControl();
                  }
                }

                let speedX = Math.abs(
                  (control.x - olRopeOne.control.x) / this.options.backSpeed,
                );
                speedX = speedX < 1 ? 1 : speedX;
                if (direction.verticle == 'left') {
                  ropeOne.control.x -= speedX;
                } else {
                  ropeOne.control.x += speedX;
                }
                let speedY = Math.abs(
                  (control.y - olRopeOne.control.y) / this.options.backSpeed,
                );
                speedY = speedY < 1 ? 1 : speedY;
                if (direction.herit == 'top') {
                  ropeOne.control.y = olRopeOne.control.y - speedY;
                } else {
                  ropeOne.control.y = olRopeOne.control.y + speedY;
                }
                if (
                  initControlX - olRopeOne.control.x < Math.abs(8) &&
                  initControlY - olRopeOne.control.y < Math.abs(8)
                ) {
                  this.springbackTimer && clearInterval(this.springbackTimer);
                  ropeOne.control.x = olRopeOne.control.x;
                  ropeOne.control.y = olRopeOne.control.y;
                }
                if (!this.ctx) return;
                this.ctx.clearRect(
                  0,
                  0,
                  this.options.width,
                  this.options.height,
                );
                this.drawRope();
                this.nodePoint.forEach((point, i) => {
                  const startPoint = this.getItemPoint({
                    row: point.row,
                    rowIndex: point.rowIndex,
                  });
                  if (startPoint) point.startPoint = startPoint;
                  point.endPoint = this.getSwingPointBydeg(
                    point.startPoint,
                    point.deg,
                  );
                  this.drawItem(point, i);
                });
              }, 10);
            };
          };
        }
      }, 300);
    });
  }
  destory() {
    if (this.cvs) {
      this.cvs.removeEventListener('mousedown', () => {});
      this.cvs.removeEventListener('dblclick', () => {});
    }
    document.onmousemove = (e) => {};
    document.onmouseup = (e) => {};
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.springbackTimer) {
      clearInterval(this.springbackTimer);
    }
  }
  shakeRunner() {
    this.nodePoint.forEach((item, i) => {
      if (!item.shake) return;
      const point = item.startPoint;
      let speed = this.speed;
      if (item.deg > (Math.PI * 3) / 4) {
        item.deg -= speed;
        item.direction = 'right';
      } else if (item.deg <= Math.PI / 4) {
        item.deg += speed;
        item.direction = 'left';
      } else {
        item.deg =
          item.direction == 'left' ? item.deg + speed : item.deg - speed;
      }
      item.endPoint = this.getSwingPointBydeg(point, item.deg);
    });
  }
  animationShake() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.options.width, this.options.height);
    this.drawRope();
    this.nodePoint.forEach((item, i) => {
      this.drawItem(item, i);
    });
  }
  update() {
    this.timer = setInterval(() => {
      this.shakeRunner();
      this.animationShake();
    }, 150);
  }
}
