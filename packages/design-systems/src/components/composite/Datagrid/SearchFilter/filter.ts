import type { ApplicableType, JointCondition } from "./types";
import type { Localization } from "@locales/types";

const GraphQLFilterOperator = {
  EQUAL: "eq",
  LESS_THAN: "lt",
  GREATER_THAN: "gt",
  LESS_THAN_OR_EQUAL: "lte",
  GREATER_THAN_OR_EQUAL: "gte",
  NOT_EQUAL: "ne",
  CONTAINS: "contains",
  IN: "in",
} as const;

type FilterCondition = {
  label: string;
  value: (typeof GraphQLFilterOperator)[keyof typeof GraphQLFilterOperator];
  applicableTypeTypes: ApplicableType[];
  disabled: boolean;
};

export const getLocalizedFilterConditions = (
  localization: Localization,
): FilterCondition[] => {
  return [
    {
      label: localization.filter.condition.operatorLabel.equal,
      value: GraphQLFilterOperator.EQUAL,
      applicableTypeTypes: [
        "string",
        "enum",
        "time",
        "dateTime",
        "date",
        "number",
        "boolean",
      ],
      disabled: false,
    },
    {
      label: localization.filter.condition.operatorLabel.notEqual,
      value: GraphQLFilterOperator.NOT_EQUAL,
      applicableTypeTypes: ["enum", "boolean"],
      disabled: false,
    },
    {
      label: localization.filter.condition.operatorLabel.include,
      value: GraphQLFilterOperator.CONTAINS,
      applicableTypeTypes: ["string"],
      disabled: false,
    },
    {
      label: localization.filter.condition.operatorLabel.greaterThan,
      value: GraphQLFilterOperator.GREATER_THAN,
      applicableTypeTypes: ["time", "dateTime", "date", "number"],
      disabled: false,
    },
    {
      label: localization.filter.condition.operatorLabel.lessThan,
      value: GraphQLFilterOperator.LESS_THAN,
      applicableTypeTypes: ["time", "dateTime", "date", "number"],
      disabled: false,
    },
    {
      label: localization.filter.condition.operatorLabel.greaterThanOrEqual,
      value: GraphQLFilterOperator.GREATER_THAN_OR_EQUAL,
      applicableTypeTypes: ["time", "dateTime", "date", "number"],
      disabled: false,
    },
    {
      label: localization.filter.condition.operatorLabel.lessThanOrEqual,
      value: GraphQLFilterOperator.LESS_THAN_OR_EQUAL,
      applicableTypeTypes: ["time", "dateTime", "date", "number"],
      disabled: false,
    },
    {
      label: localization.filter.condition.operatorLabel.in,
      value: GraphQLFilterOperator.IN,
      applicableTypeTypes: [
        "string",
        "enum",
        "time",
        "dateTime",
        "date",
        "number",
      ],
      disabled: false,
    },
  ];
};
export const jointConditions: JointCondition[] = [
  { label: "AND", value: "and", disabled: false },
  { label: "OR", value: "or", disabled: false },
];
