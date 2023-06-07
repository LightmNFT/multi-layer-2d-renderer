import { z } from "zod";
import {
  TBaseField,
  formSchema,
  lightmLink,
  npmImg,
  npmLink,
} from "./lib/consts";
import MultiLayer2DRenderer, { IResource } from ".";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "./ui/form";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

import "./App.css";
import ResourceField from "./ResourceField";
import { specifiedSubResourceLayerExample } from "./lib/consts";
import { subResourceInheritRenderingContextExample } from "./lib/consts";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

function _isCorrectZ(field: TBaseField): boolean {
  try {
    typeof field.z === "string" ? JSON.parse(field.z) : field.z;
    return true;
  } catch (e) {
    return false;
  }
}

function _parse(field: TBaseField): IResource {
  const actualZ = typeof field.z === "string" ? JSON.parse(field.z) : field.z;

  return {
    src: field.src,
    z: actualZ,
    resources: field.fields
      ? field.fields
          .filter((_field) => {
            return _field.show && _isCorrectZ(_field);
          })
          .map(_parse)
      : undefined,
  };
}

function App() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resources: [
        {
          name: "Skeleton",
          src: "/Lightm_outlined.png",
          z: 1,
          show: true,
        },
        {
          name: "Fragment-1",
          src: "/Lightm-fragment-1.png",
          z: 1,
          show: false,
        },
        {
          name: "Fragment-2",
          src: "/Lightm-fragment-2.png",
          z: 1,
          show: false,
        },
      ],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="min-h-screen py-2 flex flex-col justify-center items-center gap-4 container">
      <h1 className="text-4xl font-extrabold">
        Multi-Layer-2D-Renderer
        <a href={npmLink} target="_blank">
          <img src={npmImg} />
        </a>
      </h1>
      <p className="flex items-center gap-2 text-lg font-semibold">
        Created by{" "}
        <a href={lightmLink} target="_blank" className="flex items-center">
          <img src="/Lightm.png" width={32} height={32} />
          Lightm
        </a>
      </p>
      <div className="flex flex-wrap gap-8 justify-evenly p-4">
        <div className="flex flex-col items-center gap-2">
          <Form {...form}>
            <FormField
              name="resources"
              control={form.control}
              render={({ field: { value: fields } }) => {
                const resources = fields
                  .filter((field) => field.show && _isCorrectZ(field))
                  .map(_parse);

                return (
                  <>
                    <MultiLayer2DRenderer
                      resources={resources}
                      className="max-w-[256px] max-h-[256px] aspect-square p-2 border rounded-lg"
                    />
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <div className="flex flex-col gap-2 max-h-[65vh] overflow-auto">
                        {fields.map((field, i) => {
                          const fieldChange = (newField: TBaseField) => {
                            const newFields = [...fields];

                            newFields[i] = newField;

                            form.setValue("resources", newFields);
                          };

                          const addSubField = () => {
                            const newFields = [...fields];

                            newFields[i] = { ...newFields[i] };

                            newFields[i].fields = [
                              ...(newFields[i].fields || []),
                              {
                                name: `name-${
                                  newFields[i].fields?.length || "0"
                                }`,
                                z: 1,
                                src: "",
                                show: false,
                              },
                            ];

                            form.setValue("resources", newFields);
                          };

                          const deleteField = () => {
                            const newFields = [...fields];

                            newFields.splice(i, 1);

                            form.setValue("resources", newFields);
                          };

                          return (
                            <ResourceField
                              key={`${i}-${field.name}`}
                              field={field}
                              onFieldChange={fieldChange}
                              addSubField={addSubField}
                              deleteField={deleteField}
                            />
                          );
                        })}
                        <Button
                          variant="secondary"
                          onClick={() => {
                            form.setValue("resources", [
                              ...fields,
                              {
                                name: `name-${fields.length.toString()}`,
                                z: 1,
                                src: "",
                                show: false,
                              },
                            ]);
                          }}
                        >
                          <PlusCircle />
                        </Button>
                      </div>
                    </form>
                  </>
                );
              }}
            />
          </Form>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <p className="text-xl font-bold">
            Try advanced uses of <code>"z"</code>
          </p>
          <p>
            They are useful when layers are rendered with a structure that needs
            to be different from resources parent-child relationships
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Specified Sub Resources Layer</AccordionTrigger>
              <AccordionContent>
                <p className="text-red-500">Red - 1</p>
                <p className="text-blue-500">Blue - 2.1</p>
                <p className="text-green-500">Green - 3</p>
                <Button
                  variant="secondary"
                  onClick={() =>
                    form.setValue("resources", specifiedSubResourceLayerExample)
                  }
                >
                  Try
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Sub Resources Inherit Rendering Context
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-red-500">Red - 2</p>
                <p className="text-blue-500">Blue - 1</p>
                <p className="text-green-500">Green - 3</p>
                <Button
                  variant="secondary"
                  onClick={() =>
                    form.setValue(
                      "resources",
                      subResourceInheritRenderingContextExample
                    )
                  }
                >
                  Try
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default App;
