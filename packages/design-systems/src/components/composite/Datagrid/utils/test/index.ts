import type { RootQueryFilter } from "../../SearchFilter/types";
import { Column, Order } from "../../types";

export enum PaymentStatus {
  pending = "pending",
  processing = "processing",
  success = "success",
  failed = "failed",
}

export type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
  createdAt: string;
  isCreditCard: boolean;
  updatedAt: string;
};

export const columns: Column<Payment>[] = [
  {
    accessorKey: "status",
    label: "Status",
    value: "Status",
    meta: {
      type: "enum",
      enumType: PaymentStatus,
    },
    disabled: false,
  },
  {
    accessorKey: "email",
    label: "Email",
    value: "Email",
    meta: {
      type: "string",
    },
    disabled: false,
  },
  {
    accessorKey: "amount",
    label: "Amount",
    value: "Amount",
    meta: {
      type: "number",
    },
    disabled: false,
  },
  {
    accessorKey: "createdAt",
    label: "CreatedAt",
    value: "CreatedAt",
    meta: {
      type: "date",
    },
    disabled: false,
  },
  {
    accessorKey: "isCreditCard",
    label: "CreditCardUsed",
    value: "CreditCardUsed",
    meta: {
      type: "boolean",
    },
    disabled: false,
  },
  {
    accessorKey: "updatedAt",
    label: "UpdatedAt",
    value: "UpdatedAt",
    meta: {
      type: "dateTime",
    },
    disabled: false,
  },
];

export const originData: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
    createdAt: "2023-11-14",
    isCreditCard: true,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "a6b2c3d4",
    amount: 200,
    status: "processing",
    email: "john@example.com",
    createdAt: "2023-11-13",
    isCreditCard: false,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "f8e7d6c5",
    amount: 150,
    status: "success",
    email: "sara@example.com",
    createdAt: "2023-11-12",
    isCreditCard: false,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "b5c4d3e2",
    amount: 50,
    status: "failed",
    email: "fail@example.com",
    createdAt: "2023-11-11",
    isCreditCard: true,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "12345678",
    amount: 300,
    status: "pending",
    email: "example1@example.com",
    createdAt: "2023-11-10",
    isCreditCard: true,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "23456789",
    amount: 400,
    status: "processing",
    email: "example2@example.com",
    createdAt: "2023-11-09",
    isCreditCard: true,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "34567890",
    amount: 500,
    status: "success",
    email: "example3@example.com",
    createdAt: "2023-11-08",
    isCreditCard: false,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "718ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
    createdAt: "2023-11-14",
    isCreditCard: true,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "a6b1c3d4",
    amount: 200,
    status: "processing",
    email: "john@example.com",
    createdAt: "2023-11-13",
    isCreditCard: false,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "f8e7d6c1",
    amount: 150,
    status: "success",
    email: "sara@example.com",
    createdAt: "2023-11-12",
    isCreditCard: false,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "b5c4d3e1",
    amount: 50,
    status: "failed",
    email: "fail@example.com",
    createdAt: "2023-11-11",
    isCreditCard: true,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "42345678",
    amount: 300,
    status: "pending",
    email: "example1@example.com",
    createdAt: "2023-11-10",
    isCreditCard: true,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "53456789",
    amount: 400,
    status: "processing",
    email: "example2@example.com",
    createdAt: "2023-11-09",
    isCreditCard: true,
    updatedAt: "2023-11-12 12:00:00",
  },
  {
    id: "64567890",
    amount: 500,
    status: "success",
    email: "example3@example.com",
    createdAt: "2023-11-08",
    isCreditCard: false,
    updatedAt: "2023-11-12 12:00:00",
  },
];

export const setFilterChange = (
  filter: RootQueryFilter | undefined,
  data: Payment[],
  setData: React.Dispatch<React.SetStateAction<Payment[]>>,
) => {
  if (!filter) {
    setData(data);
    return;
  }
  const topLevelAnd = filter.and;

  const customFilterValue = topLevelAnd["and"];
  // topLevelAndからandを除外したものがsystemFilterValue
  const systemFilterValue = { ...topLevelAnd, and: undefined };

  const isSystemFilterExist = Object.keys(systemFilterValue).length > 1;

  if (customFilterValue && isSystemFilterExist) {
    const eqValue = systemFilterValue as unknown as { status: { eq: string } };

    if (
      eqValue.status &&
      Array.isArray(customFilterValue) &&
      customFilterValue.length > 0
    ) {
      const gtValue = (
        customFilterValue[0] as unknown as { amount: { gt: string } }
      ).amount.gt;
      setData(
        data.filter(
          (item) =>
            item.amount > Number(gtValue) && item.status === eqValue.status.eq,
        ),
      );
    }

    return;
  }

  if (isSystemFilterExist) {
    const eqValue = systemFilterValue as unknown as { status: { eq: string } };
    if (eqValue.status) {
      setData(data.filter((item) => item.status === eqValue.status.eq));
    }

    if (topLevelAnd && Array.isArray(topLevelAnd)) {
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
    } else {
      if (topLevelAnd.amount) {
        const gtValue = (topLevelAnd as unknown as { amount: { gt: string } })
          .amount.gt;

        if ("status" in systemFilterValue) {
          const eqValue = (
            systemFilterValue as unknown as { status: { eq: string } }
          ).status.eq;
          setData(
            data.filter(
              (item) =>
                item.status === eqValue && item.amount > Number(gtValue),
            ),
          );
          return;
        }
        setData(data.filter((item) => item.amount > Number(gtValue)));
        return;
      }

      if ("isCreditCard" in systemFilterValue) {
        const eqValue = (
          systemFilterValue as unknown as { isCreditCard: { eq: boolean } }
        ).isCreditCard.eq;
        setData(data.filter((item) => item.isCreditCard === eqValue));
        return;
      }
      if ("status" in systemFilterValue) {
        const eqValue = (
          systemFilterValue as unknown as { status: { eq: string } }
        ).status.eq;

        setData(data.filter((item) => item.status === eqValue));
        return;
      }
    }
    return;
  }
  if (Array.isArray(customFilterValue) && customFilterValue.length > 0) {
    const gtValue = (
      customFilterValue[0] as unknown as { amount: { gt: string } }
    ).amount.gt;
    setData(data.filter((item) => item.amount > Number(gtValue)));
    if (customFilterValue.length > 1) {
      const eqValue = (
        customFilterValue[1] as unknown as { status: { eq: string } }
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
            ? 1
            : !a.isCreditCard && b.isCreditCard
              ? -1
              : 0
          : a.isCreditCard && !b.isCreditCard
            ? -1
            : !a.isCreditCard && b.isCreditCard
              ? 1
              : 0;
      default:
        return 0;
    }
  });
};
