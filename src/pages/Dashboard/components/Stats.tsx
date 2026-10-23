import {
  IconCategory,
  IconPackage,
  IconReceipt2,
  IconShoppingCart,
  IconTrendingUp,
  IconUsers
} from '@tabler/icons-react';
import { Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';

import cx from 'clsx';

import formatPrice from '@common/utils/formatPrice';
import { dashboard } from '@/locale/uz';

import type { DashboardStats } from '../analytics';

import classes from '../Dashboard.module.scss';

const STAT_CARDS = [
  {
    key: 'customers',
    label: dashboard.customers,
    icon: IconUsers,
    color: 'blue'
  },
  {
    key: 'products',
    label: dashboard.products,
    icon: IconPackage,
    color: 'indigo'
  },
  {
    key: 'categories',
    label: dashboard.categories,
    icon: IconCategory,
    color: 'cyan'
  },
  {
    key: 'orders',
    label: dashboard.orders,
    icon: IconShoppingCart,
    color: 'teal'
  },
  {
    key: 'activeProducts',
    label: dashboard.activeProducts,
    icon: IconPackage,
    color: 'green'
  },
  {
    key: 'totalRevenue',
    label: dashboard.totalRevenue,
    icon: IconTrendingUp,
    color: 'orange'
  }
] as const;

type IProps = {
  stats: DashboardStats;
};

const formatStatValue = (key: (typeof STAT_CARDS)[number]['key'], stats: DashboardStats) => {
  if (key === 'totalRevenue') return `${formatPrice(stats.totalRevenue)} UZS`;
  return String(stats[key]);
};

const Stats = ({ stats }: IProps) => {
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
      {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
        <Paper
          key={key}
          withBorder
          p="lg"
          className={cx(classes.statCard, key === 'totalRevenue' && classes.statCardPrimary)}
        >
          <Group justify="space-between" align="center" wrap="nowrap" mb="md">
            <Text className={classes.statLabel}>{label}</Text>
            <ThemeIcon variant="light" color={color} radius="md" size={36}>
              <Icon size={18} stroke={1.75} />
            </ThemeIcon>
          </Group>
          <Text className={classes.statValue}>{formatStatValue(key, stats)}</Text>
          {key === 'totalRevenue' && stats.averageOrderValue > 0 ? (
            <Group gap={6} mt={8} wrap="nowrap" className={classes.statMeta}>
              <IconReceipt2 size={14} stroke={1.75} />
              <span>
                {dashboard.averageOrder}: {formatPrice(stats.averageOrderValue)} UZS
              </span>
            </Group>
          ) : null}
        </Paper>
      ))}
    </SimpleGrid>
  );
};

export default Stats;
