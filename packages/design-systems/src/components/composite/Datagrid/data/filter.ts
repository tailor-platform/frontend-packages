import {
  FilterCondition,
  GraphQLFilterOperator,
  JointCondition,
} from "../types";
import type { Localization } from "../../../../locales/types";

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
      label: localization.filter.condition.operatorLabel.notInclude,
      value: GraphQLFilterOperator.NOT_LIKE,
      applicableTypeTypes: [],
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
  ];
};
export const jointConditions: JointCondition[] = [
  { label: "AND", value: "and", disabled: false },
  { label: "OR", value: "or", disabled: false },
];
