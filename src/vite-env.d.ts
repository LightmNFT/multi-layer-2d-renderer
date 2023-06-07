/// <reference types="vite/client" />

import { Application, ICanvas } from "pixi.js";

declare global {
  interface Window {
    __PIXI_APP__: Application<ICanvas> | undefined;
  }
}
