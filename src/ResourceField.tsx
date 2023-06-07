import { MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { FormItem, FormControl, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { TBaseField } from "./lib/consts";
import { Switch } from "./ui/switch";

export default function ResourceField({
  field,
  onFieldChange,
  addSubField,
  deleteField,
}: {
  field: TBaseField;
  onFieldChange: (field: TBaseField) => void;
  addSubField: () => void;
  deleteField: () => void;
}) {
  return (
    <FormItem key={field.name}>
      <div className="flex flex-col gap-2 p-2 border-2 rounded-xl bg-gray-100/20">
        <div className="flex justify-between items-center gap-2">
          <FormControl>
            <Input
              placeholder="name"
              value={field.name}
              onChange={(e) => {
                onFieldChange({
                  ...field,
                  name: e.target.value,
                });
              }}
            />
          </FormControl>
          <FormControl>
            <Switch
              checked={field.show}
              onCheckedChange={(checked) => {
                onFieldChange({
                  ...field,
                  show: checked,
                });
              }}
            />
          </FormControl>
        </div>
        <FormLabel htmlFor={`${field.name}-src`}>src</FormLabel>
        <FormControl>
          <Input
            id={`${field.name}-src`}
            placeholder="src"
            value={field.src}
            onChange={(e) => {
              onFieldChange({
                ...field,
                src: e.target.value,
              });
            }}
          />
        </FormControl>
        <FormLabel htmlFor={`${field.name}-z`}>z</FormLabel>
        <FormControl>
          <Input
            id={`${field.name}-z`}
            placeholder="z"
            value={field.z}
            onChange={(e) => {
              onFieldChange({
                ...field,
                z: e.target.value,
              });
            }}
          />
        </FormControl>
        <FormMessage />
        <div className="p-2 flex flex-col justify-center gap-2 border-2 border-dashed bg-gray-100/40 rounded-xl">
          <div className="text-center">Sub Resources</div>
          {field.fields?.map((_subField, i) => {
            const subFieldChange = (newField: TBaseField) => {
              const newSubFields = [...(field.fields || [])];

              newSubFields[i] = newField;

              onFieldChange({ ...field, fields: newSubFields });
            };

            const subAddSubField = () => {
              const newSubFields = [...(field.fields || [])];

              newSubFields[i] = { ...newSubFields[i] };

              newSubFields[i].fields = [
                ...(newSubFields[i].fields || []),
                {
                  name: `name-${newSubFields[i].fields?.length || "0"}`,
                  z: 1,
                  src: "",
                  show: false,
                },
              ];

              onFieldChange({ ...field, fields: newSubFields });
            };

            const subDeleteField = () => {
              const newSubFields = [...(field.fields || [])];

              newSubFields.splice(i, 1);

              onFieldChange({ ...field, fields: newSubFields });
            };

            return (
              <ResourceField
                key={`${i}-${_subField.name}`}
                field={_subField}
                onFieldChange={subFieldChange}
                addSubField={subAddSubField}
                deleteField={subDeleteField}
              />
            );
          })}

          <Button
            variant="outline"
            className="border-dashed gap-1"
            onClick={addSubField}
          >
            <PlusCircle />
            {"Add Sub Resource"}
          </Button>
        </div>
        <Button variant="ghost" onClick={deleteField}>
          <MinusCircle />
        </Button>
      </div>
    </FormItem>
  );
}
