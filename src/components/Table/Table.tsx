import type { ReactNode } from "react";
import { Loader, Table as MantineTable, Text } from "@mantine/core";

import classes from "./Table.module.css";

export type TableColumn<T> = {
  key: string;
  title: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
};

type IProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  minWidth?: number | string;
};

function getCellValue<T extends object>(row: T, key: string): ReactNode {
  if (!(key in row)) return "—";

  const value = row[key as keyof T];

  if (value == null) return "—";
  if (typeof value === "boolean") return value ? "Ha" : "Yo'q";
  if (typeof value === "object") return JSON.stringify(value);

  return String(value);
}

function Table<T extends object>({
  columns,
  data,
  rowKey = (_row, index) => index,
  loading = false,
  emptyMessage = "Ma'lumot topilmadi",
  minWidth = 640,
}: IProps<T>) {
  if (loading) {
    return (
      <div className={classes.state}>
        <Loader color="blue" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={classes.state}>
        <Text c="dimmed" size="sm">
          {emptyMessage}
        </Text>
      </div>
    );
  }

  return (
    <div className={classes.table}>
      <MantineTable.ScrollContainer minWidth={minWidth}>
        <MantineTable
          striped="odd"
          highlightOnHover
          withRowBorders
          horizontalSpacing="md"
          verticalSpacing="sm"
        >
          <MantineTable.Thead>
            <MantineTable.Tr>
              {columns.map((column) => (
                <MantineTable.Th
                  key={column.key}
                  style={{ width: column.width }}
                  ta={column.align}
                >
                  {column.title}
                </MantineTable.Th>
              ))}
            </MantineTable.Tr>
          </MantineTable.Thead>

          <MantineTable.Tbody>
            {data.map((row, index) => (
              <MantineTable.Tr key={rowKey(row, index)}>
                {columns.map((column) => (
                  <MantineTable.Td key={column.key} ta={column.align}>
                    {column.render
                      ? column.render(row, index)
                      : getCellValue(row, column.key)}
                  </MantineTable.Td>
                ))}
              </MantineTable.Tr>
            ))}
          </MantineTable.Tbody>
        </MantineTable>
      </MantineTable.ScrollContainer>
    </div>
  );
}

export default Table;
