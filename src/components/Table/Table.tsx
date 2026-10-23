import type { ReactNode } from "react";
import { Skeleton, Table as MantineTable, Text } from "@mantine/core";
import { IconInbox } from "@tabler/icons-react";
import cx from "clsx";

import classes from "./Table.module.css";

export type TableColumn<T> = {
  key: string;
  title: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
  /** Numbers/money: right-aligned with tabular figures (implies align="right"). */
  numeric?: boolean;
  /** Keeps the cell on one line (use for dates, ids, prices). */
  nowrap?: boolean;
};

type IProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  minWidth?: number | string;
  /** Optional card header: title, record count, description, toolbar and actions. */
  title?: ReactNode;
  description?: ReactNode;
  count?: number;
  toolbar?: ReactNode;
  actions?: ReactNode;
};

const SKELETON_ROWS = 5;

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
  title,
  description,
  count,
  toolbar,
  actions,
}: IProps<T>) {
  const hasHeader = Boolean(title || description || toolbar || actions || count !== undefined);
  const alignOf = (column: TableColumn<T>) => (column.numeric ? "right" : column.align);
  const cellClass = (column: TableColumn<T>) =>
    cx(column.numeric && classes.numeric, (column.nowrap || column.numeric) && classes.nowrap);

  const header = hasHeader ? (
    <div className={classes.header}>
      {(title || description || count !== undefined || actions) && (
        <div className={classes.headerTop}>
          <div className={classes.heading}>
            {(title || count !== undefined) && (
              <div className={classes.titleRow}>
                {title && <span className={classes.title}>{title}</span>}
                {count !== undefined && <span className={classes.count}>{count}</span>}
              </div>
            )}
            {description && <span className={classes.description}>{description}</span>}
          </div>
          {actions && <div className={classes.actions}>{actions}</div>}
        </div>
      )}
      {toolbar && <div className={classes.toolbar}>{toolbar}</div>}
    </div>
  ) : null;

  const head = (
    <MantineTable.Thead>
      <MantineTable.Tr>
        {columns.map((column) => (
          <MantineTable.Th
            key={column.key}
            style={{ width: column.width }}
            ta={alignOf(column)}
            className={classes.nowrap}
          >
            {column.title}
          </MantineTable.Th>
        ))}
      </MantineTable.Tr>
    </MantineTable.Thead>
  );

  const renderTable = (body: ReactNode) => (
    <MantineTable.ScrollContainer minWidth={minWidth} type="native">
      <MantineTable
        highlightOnHover={false}
        withRowBorders={false}
        horizontalSpacing="md"
        verticalSpacing="sm"
        classNames={{ table: classes.mantineTable, thead: classes.thead, th: classes.th, tr: classes.tr, td: classes.td }}
      >
        {head}
        <MantineTable.Tbody>{body}</MantineTable.Tbody>
      </MantineTable>
    </MantineTable.ScrollContainer>
  );

  let content: ReactNode;

  if (loading) {
    content = renderTable(
      Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
        <MantineTable.Tr key={rowIndex} aria-hidden>
          {columns.map((column, columnIndex) => (
            <MantineTable.Td key={column.key}>
              <Skeleton height={12} radius="sm" width={columnIndex === 0 ? "60%" : `${50 + ((rowIndex + columnIndex) % 4) * 10}%`} />
            </MantineTable.Td>
          ))}
        </MantineTable.Tr>
      )),
    );
  } else if (!data.length) {
    content = (
      <div className={classes.state}>
        <span className={classes.stateIcon}>
          <IconInbox size={22} stroke={1.5} />
        </span>
        <Text className={classes.stateText}>{emptyMessage}</Text>
      </div>
    );
  } else {
    content = renderTable(
      data.map((row, index) => (
        <MantineTable.Tr key={rowKey(row, index)}>
          {columns.map((column) => (
            <MantineTable.Td key={column.key} ta={alignOf(column)} className={cellClass(column)}>
              {column.render ? column.render(row, index) : getCellValue(row, column.key)}
            </MantineTable.Td>
          ))}
        </MantineTable.Tr>
      )),
    );
  }

  return (
    <div className={classes.table} aria-busy={loading || undefined}>
      {header}
      {content}
    </div>
  );
}

export default Table;
