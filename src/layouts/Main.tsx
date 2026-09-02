import { AppShell } from '@mantine/core';
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';

import { Header } from '@/layouts/components/Header';
import { Sidebar } from '@/layouts/components/Sidebar';

import { layout } from './layout';
import classes from './Main.module.scss';

export default function MainLayout() {
  const { header, sidebar } = layout;
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure();
  const [collapsed, setCollapsed] = useLocalStorage({
    key: 'sidebar-collapsed',
    defaultValue: false
  });

  // The mobile navbar is a drawer, so it always shows the full sidebar.
  const isDesktop = useMediaQuery('(min-width: 48em)', true, { getInitialValueInEffect: false });
  const isCollapsed = collapsed && !!isDesktop;

  return (
    <AppShell
      header={{ height: header.height }}
      navbar={{
        width: { base: sidebar.width, sm: isCollapsed ? sidebar.collapsedWidth : sidebar.width },
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened }
      }}
      padding="md"
      transitionDuration={200}
      classNames={{ root: classes.shell }}
    >
      <Header
        collapsed={collapsed}
        mobileOpened={mobileOpened}
        onToggleMobile={toggleMobile}
        onToggleCollapsed={() => setCollapsed(value => !value)}
      />

      <AppShell.Navbar className={classes.navbar}>
        <Sidebar collapsed={isCollapsed} onNavigate={closeMobile} />
      </AppShell.Navbar>

      <AppShell.Main classNames={{ main: classes.main }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
