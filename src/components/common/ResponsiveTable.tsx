import { Table, type TableProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface ResponsiveTableProps extends TableProps {
  children: ReactNode;
  minWidth?: number | string;
}

export function ResponsiveTable({
  children,
  minWidth = 640,
  ...tableProps
}: ResponsiveTableProps) {
  return (
    <Table.ScrollContainer minWidth={minWidth}>
      <Table {...tableProps}>{children}</Table>
    </Table.ScrollContainer>
  );
}
