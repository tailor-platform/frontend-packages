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
  switch (true) {
    case typeof filter?.and !== "undefined":
      if (
        typeof filter?.status?.eq !== "undefined" ||
        typeof filter?.status?.ne !== "undefined"
      ) {
        if (
          typeof filter?.and?.amount === "object" &&
          filter?.and?.amount !== null
        ) {
          switch (true) {
            case "eq" in filter.and.amount: {
              const eqValue = filter.and.amount.eq;
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter(
                    (row) =>
                      row.amount === Number(eqValue) &&
                      row.status === filter.status.eq,
                  ),
                );
              } else {
                setData(
                  data.filter(
                    (row) =>
                      row.amount === Number(eqValue) &&
                      row.status !== filter.status.ne,
                  ),
                );
              }
              break;
            }
            case "gt" in filter.and.amount: {
              const gtValue = filter.and.amount.gt;
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter(
                    (row) =>
                      row.amount > Number(gtValue) &&
                      row.status === filter.status.eq,
                  ),
                );
              } else {
                setData(
                  data.filter(
                    (row) =>
                      row.amount > Number(gtValue) &&
                      row.status !== filter.status.ne,
                  ),
                );
              }
              break;
            }
            case "lt" in filter.and.amount: {
              const ltValue = filter.and.amount.lt;
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter(
                    (row) =>
                      row.amount < Number(ltValue) &&
                      row.status === filter.status.eq,
                  ),
                );
              } else {
                setData(
                  data.filter(
                    (row) =>
                      row.amount < Number(ltValue) &&
                      row.status !== filter.status.ne,
                  ),
                );
              }
              break;
            }
            case "gte" in filter.and.amount: {
              const gteValue = filter.and.amount.gte;
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter(
                    (row) =>
                      row.amount >= Number(gteValue) &&
                      row.status === filter.status.eq,
                  ),
                );
              } else {
                setData(
                  data.filter(
                    (row) =>
                      row.amount >= Number(gteValue) &&
                      row.status !== filter.status.ne,
                  ),
                );
              }
              break;
            }
            case "lte" in filter.and.amount: {
              const lteValue = filter.and.amount.lte;
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter(
                    (row) =>
                      row.amount <= Number(lteValue) &&
                      row.status === filter.status.eq,
                  ),
                );
              } else {
                setData(
                  data.filter(
                    (row) =>
                      row.amount <= Number(lteValue) &&
                      row.status !== filter.status.ne,
                  ),
                );
              }
              break;
            }
          }
          break;
        }
      } else {
        if (
          typeof filter?.and?.status === "object" &&
          filter?.and?.status !== null
        ) {
          switch (true) {
            case "eq" in filter.and.status: {
              const eqValue = filter.and.status.eq;
              switch (true) {
                case typeof filter?.amount?.eq !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount === Number(filter.amount.eq) &&
                        row.status === eqValue,
                    ),
                  );
                  break;
                case typeof filter?.amount?.gt !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount > Number(filter.amount.gt) &&
                        row.status === eqValue,
                    ),
                  );
                  break;
                case typeof filter?.amount?.lt !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount < Number(filter.amount.lt) &&
                        row.status === eqValue,
                    ),
                  );
                  break;
                case typeof filter?.amount?.gte !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount >= Number(filter.amount.gte) &&
                        row.status === eqValue,
                    ),
                  );
                  break;
                case typeof filter?.amount?.lte !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount <= Number(filter.amount.lte) &&
                        row.status === eqValue,
                    ),
                  );
                  break;
              }
              break;
            }
            case "ne" in filter.and.status: {
              const neValue = filter.and.status.ne;
              switch (true) {
                case typeof filter?.amount?.eq !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount === Number(filter.amount.eq) &&
                        row.status !== neValue,
                    ),
                  );
                  break;
                case typeof filter?.amount?.gt !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount > Number(filter.amount.gt) &&
                        row.status !== neValue,
                    ),
                  );
                  break;
                case typeof filter?.amount?.lt !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount < Number(filter.amount.lt) &&
                        row.status !== neValue,
                    ),
                  );
                  break;
                case typeof filter?.amount?.gte !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount >= Number(filter.amount.gte) &&
                        row.status !== neValue,
                    ),
                  );
                  break;
                case typeof filter?.amount?.lte !== "undefined":
                  setData(
                    data.filter(
                      (row) =>
                        row.amount <= Number(filter.amount.lte) &&
                        row.status !== neValue,
                    ),
                  );
                  break;
              }
              break;
            }
          }
        }
      }
      break;
    case typeof filter?.status?.eq !== "undefined":
      setData(data.filter((row) => row.status === filter.status.eq));
      break;
    case typeof filter?.status?.ne !== "undefined":
      setData(data.filter((row) => row.status !== filter.status.ne));
      break;
    case typeof filter?.amount?.eq !== "undefined":
      setData(data.filter((row) => row.amount === Number(filter.amount.eq)));
      break;
    case typeof filter?.amount?.gt !== "undefined":
      setData(data.filter((row) => row.amount > Number(filter.amount.gt)));
      break;
    case typeof filter?.amount?.lt !== "undefined":
      setData(data.filter((row) => row.amount < Number(filter.amount.lt)));
      break;
    case typeof filter?.amount?.gte !== "undefined":
      setData(data.filter((row) => row.amount >= Number(filter.amount.gte)));
      break;
    case typeof filter?.amount?.lte !== "undefined":
      setData(data.filter((row) => row.amount <= Number(filter.amount.lte)));
      break;
    case typeof filter?.updatedAt?.eq !== "undefined":
      setData(
        data.filter((row) => {
          return row.updatedAt === filter.updatedAt.eq;
        }),
      );
      break;
    default: {
      setData(data);
    }
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
