import { z } from "zod";

export const lightmLink = "https://lightm.xyz";

export const npmImg =
  "https://img.shields.io/npm/v/@lightm-nft/multi-layer-2d-renderer.svg?style=flat";

export const npmLink =
  "https://www.npmjs.com/package/@lightm-nft/multi-layer-2d-renderer";

export const INHERIT_RENDER_CONTEXT = "INHERIT";

const baseFieldSchema = z.object({
  name: z.string().min(1).max(50),
  z: z.union([z.string(), z.number()]),
  src: z.string(),
  show: z.boolean(),
});

export type TBaseField = z.infer<typeof baseFieldSchema> & {
  fields?: TBaseField[];
};

export const fieldSchema: z.ZodType<TBaseField> = baseFieldSchema.extend({
  fields: z.optional(z.lazy(() => fieldSchema.array())),
});

export const formSchema = z.object({ resources: z.array(fieldSchema) });

export const specifiedSubResourceLayerExample: TBaseField[] = [
  {
    name: "red",
    z: JSON.stringify([1, 2]),
    src: "/render-example-red.png",
    show: true,
    fields: [
      { name: "blue", z: 1, src: "/render-example-blue.png", show: true },
    ],
  },
  {
    name: "green",
    z: 3,
    src: "/render-example-green.png",
    show: true,
  },
];

export const subResourceInheritRenderingContextExample: TBaseField[] = [
  {
    name: "red",
    z: JSON.stringify([2, INHERIT_RENDER_CONTEXT]),
    src: "/render-example-red.png",
    show: true,
    fields: [
      { name: "blue", z: 1, src: "/render-example-blue.png", show: true },
    ],
  },
  {
    name: "green",
    z: 3,
    src: "/render-example-green.png",
    show: true,
  },
];
