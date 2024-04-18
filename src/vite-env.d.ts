/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare const Bol3D = {
  ...THREE
}

declare const myComp = {
  install: (app: any) => void
}
