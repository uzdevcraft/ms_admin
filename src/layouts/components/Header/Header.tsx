import { Mode } from '@/layouts/components/Mode';
import { Logo } from '@/layouts/components/Logo';
import { AppShell, Burger, Group } from '@mantine/core';

import classes from './Header.module.scss';

type IProps = {
  collapsed: boolean;
  mobileOpened: boolean;
  onToggleMobile: () => void;
  onToggleCollapsed: () => void;
};

const Header = ({ collapsed, mobileOpened, onToggleCollapsed, onToggleMobile }: IProps) => {
  return (
    <AppShell.Header className={classes.header}>
      <Group h="100%" px="md" wrap="nowrap" justify="space-between">
        <Group wrap="nowrap" gap="sm">
          <Burger opened={mobileOpened} onClick={onToggleMobile} size="sm" hiddenFrom="sm" />

          <Burger opened={!collapsed} onClick={onToggleCollapsed} size="sm" visibleFrom="sm" />

          <Logo />
        </Group>

        <Mode />
      </Group>
    </AppShell.Header>
  );
};

export default Header;
