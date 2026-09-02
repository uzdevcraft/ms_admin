import { IconCategory, IconLayoutDashboard, IconPackage, IconShoppingCart } from '@tabler/icons-react';

import { nav } from '@/locale/uz';
import type { NavItem } from '@/layouts/types';

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: nav.dashboard, icon: IconLayoutDashboard },
  { to: '/products', label: nav.products, icon: IconPackage },
  { to: '/categories', label: nav.categories, icon: IconCategory },
  { to: '/orders', label: nav.orders, icon: IconShoppingCart }
];
