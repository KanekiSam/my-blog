declare module '*.css';
declare module '*.mp3';
declare module '*.webp';
declare module '*.jpeg';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare module 'lodash';
declare module 'js-cookie';
declare module 'crypto-js';
