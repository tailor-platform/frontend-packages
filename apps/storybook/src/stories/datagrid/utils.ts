import {
  GraphQLQueryFilter,
  Order,
} from "@tailor-platform/design-systems/client";
import { Payment } from "../../types/datagrid";

export const setFilterChange = (
  filter: GraphQLQueryFilter,
  data: Payment[],
  setData: React.Dispatch<React.SetStateAction<Payment[]>>,
) => {
  const topLevelAnd = filter.and;
  const customFilterValue = topLevelAnd?.and as { [key: string]: string };
  // topLevelAndからandを除外したものがsystemFilterValue
  const systemFilterValue = { ...topLevelAnd, and: undefined };

  const isSystemFilterExist = Object.keys(systemFilterValue).length > 1;

  if (customFilterValue && isSystemFilterExist) {
    setData(
      data.filter(
        (item) =>
          item.amount > Number(customFilterValue.amount.gt) &&
          item.status === systemFilterValue.status.eq,
      ),
    );
    return;
  }

  if (isSystemFilterExist) {
    setData(data.filter((item) => item.status === systemFilterValue.status.eq));

    if (topLevelAnd.amount) {
      setData(
        data.filter(
          (item) =>
            item.status === systemFilterValue.status.eq &&
            item.amount > Number(topLevelAnd.amount.gt),
        ),
      );
    }
    return;
  }
  if (customFilterValue) {
    setData(
      data.filter((item) => item.amount > Number(customFilterValue.amount.gt)),
    );
    if (customFilterValue.and) {
      setData(
        data.filter(
          (item) =>
            item.amount > Number(customFilterValue.amount.gt) &&
            item.status === customFilterValue.and.status.eq,
        ),
      );
    }
    return;
  }
};

export const setSortChange = (
  data: Payment[],
  sorting: Order<Payment> | undefined,
): Payment[] => {
  if (!sorting) return data;
  return [...data].sort((a, b) => {
    sorting.field;
    switch (sorting.field) {
      case "amount":
        return sorting.direction === "Asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      case "status":
        return sorting.direction === "Asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      case "email":
        return sorting.direction === "Asc"
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      case "createdAt": {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sorting.direction === "Asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      case "isCreditCard":
        return sorting.direction === "Asc"
          ? a.isCreditCard && !b.isCreditCard
            ? -1
            : !a.isCreditCard && b.isCreditCard
              ? 1
              : 0
          : a.isCreditCard && !b.isCreditCard
            ? 1
            : !a.isCreditCard && b.isCreditCard
              ? -1
              : 0;
      default:
        return 0;
    }
  });
};
