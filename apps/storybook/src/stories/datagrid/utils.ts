import { GraphQLQueryFilter } from "@tailor-platform/design-systems/client";
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
        typeof filter?.status?.neq !== "undefined"
      ) {
        if (typeof filter?.and?.amount !== "string") {
          switch (true) {
            case typeof filter?.and?.amount?.eq !== "undefined":
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount === Number(filter.and.amount.eq) &&
                        row.status === filter.status.eq
                      );
                    }
                  }),
                );
              } else {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount === Number(filter.and.amount.eq) &&
                        row.status !== filter.status.neq
                      );
                    }
                  }),
                );
              }
              break;
            case typeof filter?.and?.amount?.gt !== "undefined":
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount > Number(filter.and.amount.gt) &&
                        row.status === filter.status.eq
                      );
                    }
                  }),
                );
              } else {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount > Number(filter.and.amount.gt) &&
                        row.status !== filter.status.neq
                      );
                    }
                  }),
                );
              }
              break;
            case typeof filter?.and?.amount?.lt !== "undefined":
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount < Number(filter.and.amount.lt) &&
                        row.status === filter.status.eq
                      );
                    }
                  }),
                );
              } else {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount < Number(filter.and.amount.lt) &&
                        row.status !== filter.status.neq
                      );
                    }
                  }),
                );
              }
              break;
            case typeof filter?.and?.amount?.gte !== "undefined":
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount >= Number(filter.and.amount.gte) &&
                        row.status === filter.status.eq
                      );
                    }
                  }),
                );
              } else {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount >= Number(filter.and.amount.gte) &&
                        row.status !== filter.status.neq
                      );
                    }
                  }),
                );
              }
              break;
            case typeof filter?.and?.amount?.lte !== "undefined":
              if (filter?.status?.eq !== "undefined") {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount <= Number(filter.and.amount.lte) &&
                        row.status === filter.status.eq
                      );
                    }
                  }),
                );
              } else {
                setData(
                  data.filter((row) => {
                    if (typeof filter?.and?.amount !== "string") {
                      return (
                        row.amount <= Number(filter.and.amount.lte) &&
                        row.status !== filter.status.neq
                      );
                    }
                  }),
                );
              }
              break;
          }
          break;
        }
      } else {
        if (typeof filter?.and?.status !== "string") {
          switch (true) {
            case typeof filter?.and?.status?.eq !== "undefined":
              switch (true) {
                case typeof filter?.amount?.eq !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount === Number(filter.amount.eq) &&
                          row.status === filter.and.status.eq
                        );
                      }
                    }),
                  );
                  break;
                case typeof filter?.amount?.gt !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount > Number(filter.amount.gt) &&
                          row.status === filter.and.status.eq
                        );
                      }
                    }),
                  );
                  break;
                case typeof filter?.amount?.lt !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount < Number(filter.amount.lt) &&
                          row.status === filter.and.status.eq
                        );
                      }
                    }),
                  );
                  break;
                case typeof filter?.amount?.gte !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount >= Number(filter.amount.gte) &&
                          row.status === filter.and.status.eq
                        );
                      }
                    }),
                  );
                  break;
                case typeof filter?.amount?.lte !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount <= Number(filter.amount.lte) &&
                          row.status === filter.and.status.eq
                        );
                      }
                    }),
                  );
                  break;
              }
              break;
            case typeof filter?.and?.status?.neq !== "undefined":
              switch (true) {
                case typeof filter?.amount?.eq !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount === Number(filter.amount.eq) &&
                          row.status === filter.and.status.neq
                        );
                      }
                    }),
                  );
                  break;
                case typeof filter?.amount?.gt !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount > Number(filter.amount.gt) &&
                          row.status === filter.and.status.neq
                        );
                      }
                    }),
                  );
                  break;
                case typeof filter?.amount?.lt !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount < Number(filter.amount.lt) &&
                          row.status === filter.and.status.neq
                        );
                      }
                    }),
                  );
                  break;
                case typeof filter?.amount?.gte !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount >= Number(filter.amount.gte) &&
                          row.status === filter.and.status.neq
                        );
                      }
                    }),
                  );
                  break;
                case typeof filter?.amount?.lte !== "undefined":
                  setData(
                    data.filter((row) => {
                      if (typeof filter?.and?.status !== "string") {
                        return (
                          row.amount <= Number(filter.amount.lte) &&
                          row.status === filter.and.status.neq
                        );
                      }
                    }),
                  );
                  break;
              }
              break;
          }
        }
      }
      break;
    case typeof filter?.status?.eq !== "undefined":
      setData(data.filter((row) => row.status === filter.status.eq));
      break;
    case typeof filter?.status?.neq !== "undefined":
      setData(data.filter((row) => row.status !== filter.status.neq));
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
  }
};
