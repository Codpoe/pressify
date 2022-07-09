/// <reference types="vite/client" />

declare const __HASH_ROUTER__: boolean;

declare module 'virtual:icons/*' {
  import React, { SVGProps } from 'react';
  const component: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  export default component;
}

declare module '~icons/*' {
  import React, { SVGProps } from 'react';
  const component: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  export default component;
}
