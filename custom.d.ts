declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png';

declare module '*.jpg';

declare module '*.glsl' {
  const value: string;
  export default value;
}
