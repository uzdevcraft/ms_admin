import { modals } from '@mantine/modals';
import { IconLogout } from '@tabler/icons-react';
import { ActionIcon, AppShell, Text } from '@mantine/core';

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
  const userRole = useAuthStore(state => state.user?.role);
  // The user isn't always loaded (only ADMIN accounts can sign in), so hide admin
  // items only for a user that is known to have another role.
  const navItems = NAV_ITEMS.filter(item => !item.adminOnly || !userRole || userRole === 'ADMIN');
  // Keeps the order of NAV_ITEMS; a group appears where its first item is.
  const groups = navItems.reduce<{ label: string; items: typeof navItems }[]>((acc, item) => {
    const existing = acc.find(group => group.label === item.group);
    if (existing) existing.items.push(item);
    else acc.push({ label: item.group, items: [item] });
    return acc;
  }, []);

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
      <AppShell.Section py="md" px="sm" grow className={classes.navLinks} data-collapsed={collapsed || undefined}>
        {groups.map(group => (
          <div key={group.label} className={classes.group} role="group" aria-label={group.label}>
            {collapsed ? (
              <span className={classes.groupDivider} aria-hidden />
            ) : (
              <Text className={classes.sectionLabel}>{group.label}</Text>
            )}
            {group.items.map(item => (
              <Item key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </AppShell.Section>

      <AppShell.Section py="md" px="sm" className={classes.footer} data-collapsed={collapsed || undefined}>
        {collapsed ? (
          <ActionIcon
            size={40}
            color="red"
            variant="subtle"
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
            variant="subtle"
            justify="flex-start"
            title={LOGOUT_LABEL}
            className={classes.logoutButton}
            onClick={handleLogout}
            leftSection={<IconLogout size={18} stroke={2} />}
          />
        )}
      </AppShell.Section>
    </>
  );
};

export default Sidebar;
