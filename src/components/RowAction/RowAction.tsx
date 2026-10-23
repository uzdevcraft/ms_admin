import type { ReactNode } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import cx from 'clsx';

import classes from './RowAction.module.scss';

type IProps = {
  /** Shown as the tooltip and used as the accessible name. */
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** Destructive action: neutral at rest, red on hover/focus. */
  danger?: boolean;
  disabled?: boolean;
};

/**
 * Compact icon-only action for table rows and toolbars. Quiet by default so a
 * column of actions doesn't compete with the data; colour appears on hover.
 */
const RowAction = ({ label, icon, onClick, danger = false, disabled }: IProps) => (
  <Tooltip label={label} position="top">
    <ActionIcon
      variant="subtle"
      color={danger ? 'red' : 'gray'}
      size={32}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cx(classes.action, danger && classes.danger)}
    >
      {icon}
    </ActionIcon>
  </Tooltip>
);

export default RowAction;
