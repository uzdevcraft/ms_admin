import { NavLink as RouterNavLink } from 'react-router-dom';

import type { NavItem } from '@/layouts/types';

import cx from 'clsx';
import classes from '../Sidebar.module.scss';

type IProps = {
  item: NavItem;
  collapsed: boolean;
  onNavigate: () => void;
};

export default function Item({ item, collapsed, onNavigate }: IProps) {
  const { to, label, icon: Icon } = item;

  return (
    <RouterNavLink
      to={to}
      title={label}
      end={to === '/'}
      aria-label={label}
      onClick={onNavigate}
      className={({ isActive }) => cx(classes.navLink, isActive && classes.navLinkActive)}
    >
      <span className={classes.navLinkIcon}>
        <Icon size={collapsed ? 20 : 20} stroke={1.75} />
      </span>
      <span className={classes.navLinkLabel}>{label}</span>
    </RouterNavLink>
  );
}
