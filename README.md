<p align="center">
  <a href="https://lightm.xyz" target="_blank" rel="noopener noreferrer">
    <img width="180" height="180" src="/public/Lightm.png" alt="Lightm Logo" />
  </a>
</p>

# @lightm-nft/multi-layer-2d-renderer

[![npm version](https://img.shields.io/npm/v/@lightm-nft/multi-layer-2d-renderer.svg?style=flat)](https://www.npmjs.com/package/@lightm-nft/multi-layer-2d-renderer)

This component is used for rendering multi-layer 2d textures.

For details, check the comment in the code below.

```ts
interface IResource {
  // uri of resource, supports `http(s)://` & `ipfs://`
  src: string;

  // layer priority, the larger the value, the higher the priority.
  // `[{ z: 1, children: [{ z: 1 }, { z: 2 }] }, { z: 2 }]`
  // | layer
  // | ----- 2
  // |  ---  1-2
  // |  ---  1-1
  // | ----- 1

  // if a tuple is passed, then the 1st is the priority of current layer, and the 2nd will indicates its children resources will not be rendered in its own layer, but rendered in the specified layer which has the same rendering context with it.
  // `[{ z: [1, 3], children: [{ z: 1 }]}, { z: 2 }]`
  // | layer
  // |  ---  3-1
  // | ----- 3
  // | ----- 2
  // | ----- 1

  // NOTE there's a special value INHERIT_RENDER_CONTEXT which indicates that children can directly get into the same context with current resource, so this will look like the children resources become completely independent resources.
  // `[{ z: [1, INHERIT_RENDER_CONTEXT], children: [{ z: 1 }, { z: 3 }]}, { z: 2 }]`
  // | layer
  // | ----- 3
  // | ----- 2
  // | ----- 1 | ----- 1
  z: number | [number, number | typeof INHERIT_RENDER_CONTEXT];
  resources?: IResource[];
}

interface IMultiLayer2DRenderer {
  resources: IResource[];
  className?: string;
  style?: CSSProperties;
}
```
