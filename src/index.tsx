import { CSSProperties, useEffect } from "react";
import { Container, Sprite, Stage, useApp } from "@pixi/react";
import { useCallback, useState } from "react";
import useImage from "use-image";
import { convertIpfs } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Loader2 } from "lucide-react";
import { Texture } from "pixi.js";
import { INHERIT_RENDER_CONTEXT } from "./lib/consts";

export interface IResource {
  src: string;
  z: number | [number, number | typeof INHERIT_RENDER_CONTEXT];
  resources?: IResource[];
}

interface IMultiLayer2DRenderer {
  resources: IResource[];
  className?: string;
  style?: CSSProperties;
}

export default function MultiLayer2DRenderer({
  resources,
  className,
  style,
}: IMultiLayer2DRenderer) {
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  const onResourceLoad = useCallback((_w: number, _h: number) => {
    setW((prevW) => {
      if (_w > prevW) return _w;
      return prevW;
    });
    setH((prevH) => {
      if (_h > prevH) return _h;
      return prevH;
    });
  }, []);

  const resourceLoaded = w === 0 || h === 0;

  const actualW = w / window.devicePixelRatio;
  const actualH = h / window.devicePixelRatio;

  return (
    <>
      {resourceLoaded ? (
        <Skeleton className="w-96 h-96 bg-gray-300 flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </Skeleton>
      ) : null}

      <Stage
        width={actualW}
        height={actualH}
        options={{ backgroundColor: 0xffffff }}
        className={`object-contain ${resourceLoaded ? "hidden " : ""}${className}`}
        style={style}
      >
        <Container sortableChildren>
          {resources.map((resource, i) => (
            <Layer
              key={`${resource.src}-${i}`}
              {...resource}
              containerPosition={[actualW / 2, actualH / 2]}
              onLoad={onResourceLoad}
            />
          ))}
        </Container>
        <DevExtensionConfig />
      </Stage>
    </>
  );
}

interface ILayer extends IResource {
  containerPosition?: [number, number];
  onLoad: (w: number, h: number) => void;
}

function Layer({ src, z, resources, containerPosition, onLoad }: ILayer) {
  const url = convertIpfs(src);
  const [image] = useImage(url, "anonymous");

  useEffect(() => {
    if (image) {
      onLoad(image.width, image.height);
    }
  }, [image, onLoad]);

  const zIndex = typeof z === "number" ? z : z[0];
  const childrenZIndex = Array.isArray(z) ? z[1] : null;

  const children = resources
    ? resources.map((resource) => {
        // If childrenZIndex is "INHERIT", it means that the children should be rendered in the same context as the parent.
        // So make sure the container position is also inherited.
        const inherit = childrenZIndex === INHERIT_RENDER_CONTEXT;
        const inheritedContainerPosition = inherit ? { containerPosition } : {};

        return (
          <Layer
            {...resource}
            {...inheritedContainerPosition}
            onLoad={onLoad}
          />
        );
      })
    : null;

  const dependentRenderContext = (
    <>
      <Container sortableChildren position={containerPosition} zIndex={zIndex}>
        {image && (
          <Sprite
            anchor={1 / 2}
            texture={Texture.from(image)}
            zIndex={1}
            width={image.width / window.devicePixelRatio}
            height={image.height / window.devicePixelRatio}
          />
        )}
        {childrenZIndex === null && children}
      </Container>
    </>
  );

  // The premise here is `childrenZIndex` is exist.
  // If `childrenZIndex` is "INHERIT", it means that the children should be rendered in the same context as the parent.
  // Or it should be rendered in a specified context.
  const specialRenderContext =
    childrenZIndex !== null ? (
      childrenZIndex !== INHERIT_RENDER_CONTEXT ? (
        <Container
          sortableChildren
          position={containerPosition}
          zIndex={childrenZIndex}
        >
          {children}
        </Container>
      ) : (
        children
      )
    ) : null;

  return (
    <>
      {dependentRenderContext}
      {specialRenderContext}
    </>
  );
}

function DevExtensionConfig() {
  const app = useApp();

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__PIXI_APP__ = app;
    }
  }, [app]);

  return <></>;
}
