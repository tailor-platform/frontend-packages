"use client";

import { Box } from "@tailor-platform/design-systems";
import {
  DataGrid,
  DataGridInstance,
  useDataGrid,
} from "@tailor-platform/design-systems/client";

import { COLUMNS as columns, DATA as originData } from "../../data/datagrid.ts";
import { useState } from "react";
import { Payment } from "../../types/datagrid.ts";

export type DataGridWithFilterStoryProps = {
  enableColumnFilters?: boolean;
  table?: DataGridInstance<Record<string, unknown>>;
};

export const DataGridWithFilterStory = ({
  enableColumnFilters = false,
}: DataGridWithFilterStoryProps) => {
  const [currentFilter, setCurrentFilter] = useState({});
  const [data, setData] = useState<Payment[]>(originData);
  const table = useDataGrid({
    data,
    columns,
    enableColumnFilters,
    onFilterChange: (filter) => {
      const isSameFilter =
        JSON.stringify(filter) === JSON.stringify(currentFilter);
      if (!isSameFilter) {
        setCurrentFilter(filter);
        switch (true) {
          case typeof filter?.and !== "undefined" &&
            (filter?.status?.eq !== "undefined" ||
              filter?.status?.neq !== "undefined"):
            switch (true) {
              case typeof filter?.amount?.eq !== "undefined":
                if (filter?.status?.eq !== "undefined") {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount === Number(filter.amount.eq) &&
                        row.status === filter.status.eq,
                    ),
                  );
                } else {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount === Number(filter.amount.eq) &&
                        row.status !== filter.status.eq,
                    ),
                  );
                }
                break;
              case typeof filter?.amount?.gt !== "undefined":
                if (filter?.status?.eq !== "undefined") {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount > Number(filter.amount.gt) &&
                        row.status === filter.status.eq,
                    ),
                  );
                } else {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount > Number(filter.amount.gt) &&
                        row.status !== filter.status.eq,
                    ),
                  );
                }
                break;
              case typeof filter?.amount?.lt !== "undefined":
                if (filter?.status?.eq !== "undefined") {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount < Number(filter.amount.lt) &&
                        row.status === filter.status.eq,
                    ),
                  );
                } else {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount < Number(filter.amount.lt) &&
                        row.status !== filter.status.eq,
                    ),
                  );
                }
                break;
              case typeof filter?.amount?.gte !== "undefined":
                if (filter?.status?.eq !== "undefined") {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount >= Number(filter.amount.gte) &&
                        row.status === filter.status.eq,
                    ),
                  );
                } else {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount >= Number(filter.amount.gte) &&
                        row.status !== filter.status.eq,
                    ),
                  );
                }
                break;
              case typeof filter?.amount?.lte !== "undefined":
                if (filter?.status?.eq !== "undefined") {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount <= Number(filter.amount.lte) &&
                        row.status === filter.status.eq,
                    ),
                  );
                } else {
                  setData(
                    originData.filter(
                      (row) =>
                        row.amount <= Number(filter.amount.lte) &&
                        row.status !== filter.status.eq,
                    ),
                  );
                }
                break;
            }
            break;
          case typeof filter?.and !== "undefined" &&
            (filter?.amount?.eq !== "undefined" ||
              filter?.amout?.gt !== "undefined" ||
              filter?.amout?.lt !== "undefined" ||
              filter?.amout?.gte !== "undefined" ||
              filter?.amout?.lte !== "undefined"):
            switch (true) {
              case typeof filter?.status?.eq !== "undefined":
                switch (true) {
                  case typeof filter?.amount?.eq !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount === Number(filter.amount.eq) &&
                          row.status === filter.status.eq,
                      ),
                    );
                    break;
                  case typeof filter?.amount?.gt !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount > Number(filter.amount.gt) &&
                          row.status === filter.status.eq,
                      ),
                    );
                    break;
                  case typeof filter?.amount?.lt !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount < Number(filter.amount.lt) &&
                          row.status === filter.status.eq,
                      ),
                    );
                    break;
                  case typeof filter?.amount?.gte !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount >= Number(filter.amount.gte) &&
                          row.status === filter.status.eq,
                      ),
                    );
                    break;
                  case typeof filter?.amount?.lte !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount <= Number(filter.amount.lte) &&
                          row.status === filter.status.eq,
                      ),
                    );
                    break;
                }
                break;
              case typeof filter?.status?.neq !== "undefined":
                switch (true) {
                  case typeof filter?.amount?.eq !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount === Number(filter.amount.eq) &&
                          row.status !== filter.status.eq,
                      ),
                    );
                    break;
                  case typeof filter?.amount?.gt !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount > Number(filter.amount.gt) &&
                          row.status !== filter.status.eq,
                      ),
                    );
                    break;
                  case typeof filter?.amount?.lt !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount < Number(filter.amount.lt) &&
                          row.status !== filter.status.eq,
                      ),
                    );
                    break;
                  case typeof filter?.amount?.gte !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount >= Number(filter.amount.gte) &&
                          row.status !== filter.status.eq,
                      ),
                    );
                    break;
                  case typeof filter?.amount?.lte !== "undefined":
                    setData(
                      originData.filter(
                        (row) =>
                          row.amount <= Number(filter.amount.lte) &&
                          row.status !== filter.status.eq,
                      ),
                    );
                    break;
                }
                break;
            }
            break;
          case typeof filter?.status?.eq !== "undefined":
            setData(
              originData.filter((row) => row.status === filter.status.eq),
            );
            break;
          case typeof filter?.status?.neq !== "undefined":
            setData(
              originData.filter((row) => row.status !== filter.status.eq),
            );
            break;
          case typeof filter?.amount?.eq !== "undefined":
            setData(
              originData.filter(
                (row) => row.amount === Number(filter.amount.eq),
              ),
            );
            break;
          case typeof filter?.amount?.gt !== "undefined":
            setData(
              originData.filter((row) => row.amount > Number(filter.amount.gt)),
            );
            break;
          case typeof filter?.amount?.lt !== "undefined":
            setData(
              originData.filter((row) => row.amount < Number(filter.amount.lt)),
            );
            break;
          case typeof filter?.amount?.gte !== "undefined":
            setData(
              originData.filter(
                (row) => row.amount >= Number(filter.amount.gte),
              ),
            );
            break;
          case typeof filter?.amount?.lte !== "undefined":
            setData(
              originData.filter(
                (row) => row.amount <= Number(filter.amount.lte),
              ),
            );
            break;
        }
      }
    },
  });

  return (
    <Box w="full">
      <DataGrid table={table} />
    </Box>
  );
};

DataGridWithFilterStory.displayName = "DataGridWithFilter";
