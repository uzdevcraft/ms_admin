import {
  IconCategory,
  IconLayoutDashboard,
  IconList,
  IconPackage,
  IconShoppingCart,
  IconTemplate
} from '@tabler/icons-react';

import { nav } from '@/locale/uz';
import type { NavItem } from '@/layouts/types';

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: nav.dashboard, icon: IconLayoutDashboard, group: nav.groups.overview },
  { to: '/products', label: nav.products, icon: IconPackage, group: nav.groups.catalog },
  { to: '/categories', label: nav.categories, icon: IconCategory, group: nav.groups.catalog },
  { to: '/attributes', label: nav.attributes, icon: IconList, group: nav.groups.catalog, adminOnly: true },
  {
    to: '/attribute-templates',
    label: nav.attributeTemplates,
    icon: IconTemplate,
    group: nav.groups.catalog,
    adminOnly: true
  },
  { to: '/orders', label: nav.orders, icon: IconShoppingCart, group: nav.groups.sales }
];
