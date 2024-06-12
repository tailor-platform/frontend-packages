import type { ArgTypes } from "@storybook/react";

const inferControl = (type: string) => {
  switch (type) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "'ltr' | 'rtl'":
      return { type: "radio", options: ["ltr", "rtl"] };
    case "string":
      return "text";
    default:
      return "object";
  }
};

type PropDescriptor = {
  description: string;
  type: string;
};

type JsonProps = Record<string, Record<string, PropDescriptor>>;

export const mapJsonToProps = (jsonProps: JsonProps): ArgTypes => {
  const isSingleComponent = Object.keys(jsonProps).length === 1;

  return Object.entries(jsonProps).reduce(
    (acc, [componentName, componentProps]) => {
      const props = Object.entries(componentProps).reduce(
        (propsAcc, [key, prop]) => {
          const namespacedKey = isSingleComponent
            ? key
            : `${componentName}: ${key}`;
          return {
            ...propsAcc,
            [namespacedKey]: {
              name: namespacedKey,
              description: prop.description,
              control: inferControl(prop.type),
              type: { name: prop.type },
            },
          } as ArgTypes;
        },
        {} as ArgTypes,
      );

      return { ...acc, ...props };
    },
    {},
  );
};
