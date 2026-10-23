import type { TablerIcon } from '@tabler/icons-react';

export type NavItem = {
  to: string;
  label: string;
  icon: TablerIcon;
  /** Sidebar section heading the item is listed under. */
  group: string;
};
