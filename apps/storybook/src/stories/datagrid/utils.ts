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
    const eqValue = (systemFilterValue as unknown as { status: { eq: string } })
      .status.eq;
    const gtValue = (customFilterValue as unknown as { amount: { gt: string } })
      .amount.gt;
    setData(
      data.filter(
        (item) => item.amount > Number(gtValue) && item.status === eqValue,
      ),
    );
    return;
  }

  if (isSystemFilterExist) {
    const eqValue = systemFilterValue as unknown as { status: { eq: string } };
    setData(data.filter((item) => item.status === eqValue.status.eq));

    if (topLevelAnd.amount) {
      const gtValue = (topLevelAnd as unknown as { amount: { gt: string } })
        .amount.gt;
      const eqValue = (
        systemFilterValue as unknown as { status: { eq: string } }
      ).status.eq;
      setData(
        data.filter(
          (item) => item.status === eqValue && item.amount > Number(gtValue),
        ),
      );
    }
    return;
  }
  if (customFilterValue) {
    const gtValue = (customFilterValue as unknown as { amount: { gt: string } })
      .amount.gt;
    setData(data.filter((item) => item.amount > Number(gtValue)));
    if (customFilterValue.and) {
      const eqValue = (
        customFilterValue.and as unknown as { status: { eq: string } }
      ).status.eq;
      setData(
        data.filter(
          (item) => item.amount > Number(gtValue) && item.status === eqValue,
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
