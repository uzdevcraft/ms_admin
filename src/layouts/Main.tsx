import {
  IconCategory,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconPackage,
  IconShoppingCart
} from '@tabler/icons-react';
import { ActionIcon, AppShell, Burger, Group, Text, Title } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import type { TablerIcon } from '@tabler/icons-react';
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router-dom';
import { common, nav } from '@/locale/uz';

import cx from 'clsx';
import classes from './Main.module.scss';

const NAVBAR_WIDTH = 260;
const NAVBAR_WIDTH_COLLAPSED = 72;
const HEADER_HEIGHT = 64;

interface NavItem {
  to: string;
  label: string;
  icon: TablerIcon;
}

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  onCloseSidebar: () => void;
}

function SidebarNavItem({ item, collapsed, onCloseSidebar }: SidebarNavItemProps) {
  const { to, label, icon: Icon } = item;

  const link = (
    <RouterNavLink
      to={to}
      end={to === '/'}
      aria-label={label}
      className={({ isActive }) => cx(classes.navLink, isActive && classes.navLinkActive)}
      onClick={onCloseSidebar}
    >
      <span className={classes.navLinkIcon}>
        <Icon size={18} stroke={1.75} />
      </span>
      <span className={classes.navLinkLabel}>{label}</span>
    </RouterNavLink>
  );

  if (collapsed) {
    return <div className={classes.navLinkCollapsed}>{link}</div>;
  }

  return link;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: nav.dashboard, icon: IconLayoutDashboard },
  // { to: '/users', label: nav.users, icon: IconUsers },
  { to: '/products', label: nav.products, icon: IconPackage },
  { to: '/categories', label: nav.categories, icon: IconCategory },
  { to: '/orders', label: nav.orders, icon: IconShoppingCart }
];

const PAGE_TITLES: Record<string, string> = {
  '/': nav.dashboard,
  '/users': nav.users,
  '/products': nav.products,
  '/categories': nav.categories,
  '/orders': nav.orders
};

export default function MainLayout() {
  const location = useLocation();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [collapsed, setCollapsed] = useLocalStorage({
    key: 'sidebar-collapsed',
    defaultValue: false
  });

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'ZARO';

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      navbar={{
        width: collapsed ? NAVBAR_WIDTH_COLLAPSED : NAVBAR_WIDTH,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened }
      }}
      padding="md"
      transitionDuration={200}
      className={classes.shell}
    >
      <AppShell.Navbar p="md" className={cx(classes.navbar, classes[collapsed ? 'collapsed' : 'expanded'])}>
        <AppShell.Section grow className={classes.navLinks}>
          {NAV_ITEMS.map(item => (
            <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onCloseSidebar={toggleMobile} />
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Header className={classes.header}>
        <Group h="100%" px="md" wrap="nowrap" justify="space-between">
          <Group wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => setCollapsed(value => !value)}
              aria-label={collapsed ? common.expandSidebar : common.collapseSidebar}
              visibleFrom="sm"
            >
              {collapsed ? <IconLayoutSidebarLeftExpand size={20} /> : <IconLayoutSidebarLeftCollapse size={20} />}
            </ActionIcon>
            <Title order={4} className={classes.headerTitle}>
              {pageTitle}
            </Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
