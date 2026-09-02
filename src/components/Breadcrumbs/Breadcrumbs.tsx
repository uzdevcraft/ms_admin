import { Anchor, Breadcrumbs as MantineBreadcrumbs, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { nav } from '@/locale/uz';

import classes from './Breadcrumbs.module.scss';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export const ROUTE_LABELS: Record<string, string> = {
  '/': nav.dashboard,
  '/users': nav.users,
  '/products': nav.products,
  '/categories': nav.categories,
  '/orders': nav.orders
};

// Builds the trail from the current path: /orders/260 → Asosiy / Buyurtmalar / <title>.
// Unknown segments fall back to the page title (last segment) or the raw segment.
export const getBreadcrumbs = (pathname: string, title?: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: nav.dashboard, to: '/' }];

  segments.forEach((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;

    items.push({ label: ROUTE_LABELS[to] ?? (isLast && title ? title : segment), to });
  });

  return items;
};

type IProps = {
  items: BreadcrumbItem[];
};

const Breadcrumbs: React.FC<IProps> = ({ items }) => {
  if (!items.length) return null;

  return (
    <MantineBreadcrumbs separator={<IconChevronRight size={14} />} separatorMargin={4} className={classes.breadcrumbs}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.to) {
          return (
            <Text key={item.label} className={classes.current} span>
              {item.label}
            </Text>
          );
        }

        return (
          <Anchor key={item.to} component={Link} to={item.to} className={classes.link}>
            {item.label}
          </Anchor>
        );
      })}
    </MantineBreadcrumbs>
  );
};

export default Breadcrumbs;
