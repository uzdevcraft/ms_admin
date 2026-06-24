import {
  IconCategory,
  IconPackage,
  IconShoppingCart,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { AreaChart, BarChart, DonutChart } from '@mantine/charts';
import {
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Hooks as OrderHooks } from '@modules/orders';
import { Hooks as CategoryHooks } from '@modules/categories';
import { Hooks as ProductHooks } from '@modules/products';
import formatPrice from '@common/utils/formatPrice';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../auth/AuthContext';
import {
  buildDashboardStats,
  buildOrderStatusBarData,
  buildOrderStatusData,
  buildOrdersTrend,
  buildProductsByCategory,
} from './dashboardAnalytics';
import styles from './DashboardPage.module.css';

const STAT_CARDS = [
  { key: 'customers', label: 'Customers', icon: IconUsers, color: 'blue' },
  { key: 'products', label: 'Products', icon: IconPackage, color: 'violet' },
  { key: 'categories', label: 'Categories', icon: IconCategory, color: 'grape' },
  { key: 'orders', label: 'Orders', icon: IconShoppingCart, color: 'teal' },
  { key: 'activeProducts', label: 'Active products', icon: IconPackage, color: 'green' },
  { key: 'totalRevenue', label: 'Total revenue', icon: IconTrendingUp, color: 'cyan' },
] as const;

export function DashboardPage() {
  const { session } = useAuth();
  const users = useUsers();
  const products = ProductHooks.useList();
  const categories = CategoryHooks.useList();
  const orders = OrderHooks.useList();

  const isLoading =
    users.isLoading || products.isLoading || categories.isLoading || orders.isLoading;

  if (isLoading) return <Loader color="violet" />;

  const orderList = orders.data?.data ?? [];
  const productList = products.data?.data ?? [];
  const categoryCount = categories.data?.data.length ?? 0;
  const customerCount = users.data?.length ?? 0;

  const stats = buildDashboardStats(
    customerCount,
    productList,
    categoryCount,
    orderList,
  );
  const ordersTrend = buildOrdersTrend(orderList);
  const orderStatusData = buildOrderStatusData(orderList);
  const orderStatusBars = buildOrderStatusBarData(orderList);
  const productsByCategory = buildProductsByCategory(productList);

  const formatStatValue = (key: (typeof STAT_CARDS)[number]['key']) => {
    if (key === 'totalRevenue') return `${formatPrice(stats.totalRevenue)} UZS`;
    return String(stats[key]);
  };

  return (
    <div className={styles.page}>
      <Paper className={styles.welcome} radius="md" p="lg">
        <Title order={3} className={styles.welcomeTitle}>
          Welcome back, {session?.name}
        </Title>
        <Text className={styles.welcomeText}>
          Analytics overview for Magic Store — track orders, revenue, catalog health,
          and marketplace activity at a glance.
        </Text>
      </Paper>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md" mb="md">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <Paper key={key} withBorder radius="md" p="md" className={styles.statCard}>
            <Group justify="space-between" align="flex-start" mb="sm">
              <Text className={styles.statLabel}>{label}</Text>
              <ThemeIcon variant="light" color={color} radius="md" size="lg">
                <Icon size={18} />
              </ThemeIcon>
            </Group>
            <Text className={styles.statValue}>{formatStatValue(key)}</Text>
          </Paper>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" mb="md">
        <Paper withBorder radius="md" p="md" className={styles.chartCard}>
          <Title order={4} mb={4}>
            Orders & revenue
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Daily order volume and revenue for the last 14 days
          </Text>
          <AreaChart
            h={280}
            data={ordersTrend}
            dataKey="date"
            series={[
              { name: 'orders', color: 'blue.6', label: 'Orders' },
              { name: 'revenue', color: 'teal.6', label: 'Revenue (UZS)' },
            ]}
            curveType="monotone"
            withLegend
            withDots={false}
            gridAxis="xy"
            tickLine="xy"
            valueFormatter={(value) =>
              value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
            }
          />
        </Paper>

        <Paper withBorder radius="md" p="md" className={styles.chartCard}>
          <Title order={4} mb={4}>
            Order status
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Current distribution of orders by fulfillment status
          </Text>
          {orderStatusData.length > 0 ? (
            <Group align="center" justify="center" gap="xl" wrap="nowrap">
              <DonutChart
                data={orderStatusData}
                withLabelsLine
                labelsType="percent"
                size={220}
                thickness={28}
                chartLabel={`${stats.orders}\nOrders`}
              />
            </Group>
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              No orders yet
            </Text>
          )}
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Paper withBorder radius="md" p="md" className={styles.chartCard}>
          <Title order={4} mb={4}>
            Products by category
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Catalog breakdown across marketplace categories
          </Text>
          {productsByCategory.length > 0 ? (
            <BarChart
              h={280}
              data={productsByCategory}
              dataKey="category"
              series={[{ name: 'products', color: 'violet.6', label: 'Products' }]}
              tickLine="y"
              gridAxis="y"
              withBarValueLabel
            />
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              No products yet
            </Text>
          )}
        </Paper>

        <Paper withBorder radius="md" p="md" className={styles.chartCard}>
          <Title order={4} mb={4}>
            Orders by status
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Volume comparison across each order lifecycle stage
          </Text>
          {stats.orders > 0 ? (
            <BarChart
              h={280}
              data={orderStatusBars}
              dataKey="status"
              series={[{ name: 'orders', color: 'blue.6', label: 'Orders' }]}
              tickLine="y"
              gridAxis="y"
              withBarValueLabel
            />
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              No orders yet
            </Text>
          )}
        </Paper>
      </SimpleGrid>
    </div>
  );
}
