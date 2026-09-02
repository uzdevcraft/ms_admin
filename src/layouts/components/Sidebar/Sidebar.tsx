import { modals } from '@mantine/modals';
import { IconLogout } from '@tabler/icons-react';
import { ActionIcon, AppShell } from '@mantine/core';

import { Button } from '@/components/Button';
import { useAuthStore } from '@/modules/auth/store';

import Item from './components/Item';
import { NAV_ITEMS } from './items';

import classes from './Sidebar.module.scss';

type IProps = {
  collapsed: boolean;
  onNavigate: () => void;
};

const LOGOUT_LABEL = 'Chiqish';

const Sidebar = ({ collapsed, onNavigate }: IProps) => {
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    modals.openConfirmModal({
      centered: true,
      title: 'Tizimdan chiqishni xohlaysizmi?',
      labels: { confirm: LOGOUT_LABEL, cancel: 'Bekor qilish' },
      confirmProps: { color: 'red' },
      onConfirm: () => logout()
    });
  };

  return (
    <>
      <AppShell.Section py="md" px="xs" grow className={classes.navLinks} data-collapsed={collapsed || undefined}>
        {NAV_ITEMS.map(item => (
          <Item key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </AppShell.Section>

      <AppShell.Section pb="md" px="xs" className={classes.footer} data-collapsed={collapsed || undefined}>
        {collapsed ? (
          <ActionIcon
            size={40}
            color="red"
            variant="outline"
            onClick={handleLogout}
            aria-label={LOGOUT_LABEL}
            className={classes.logoutIcon}
          >
            <IconLogout size={18} stroke={2} />
          </ActionIcon>
        ) : (
          <Button
            fullWidth
            color="red"
            variant="outline"
            title={LOGOUT_LABEL}
            onClick={handleLogout}
            leftSection={<IconLogout size={18} stroke={2} />}
          />
        )}
      </AppShell.Section>
    </>
  );
};

export default Sidebar;
