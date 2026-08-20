import {
  AreaChart,
  BarChart,
  DonutChart,
  type DonutChartCell,
} from "@mantine/charts";
import { Group, Paper, SimpleGrid, Text, Title } from "@mantine/core";

import { dashboard } from "@/locale/uz";

import type {
  DashboardStats,
  OrderStatusBarPoint,
  OrdersTrendPoint,
  ProductsByCategoryPoint,
} from "../analytics";
import classes from "../Dashboard.module.css";

type IProps = {
  stats: DashboardStats;
  ordersTrend: OrdersTrendPoint[];
  orderStatusData: DonutChartCell[];
  orderStatusBars: OrderStatusBarPoint[];
  productsByCategory: ProductsByCategoryPoint[];
};

const Charts = ({
  stats,
  ordersTrend,
  orderStatusData,
  orderStatusBars,
  productsByCategory,
}: IProps) => {
  return (
    <>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Paper withBorder radius="md" p="md" className={classes.chartCard}>
          <Title order={4} mb={4}>
            {dashboard.ordersRevenue}
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            {dashboard.ordersRevenueDesc}
          </Text>
          <AreaChart
            h={280}
            data={ordersTrend}
            dataKey="date"
            series={[
              {
                name: "orders",
                color: "blue.6",
                label: dashboard.ordersLegend,
              },
              {
                name: "revenue",
                color: "teal.6",
                label: dashboard.revenueLegend,
              },
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

        <Paper withBorder radius="md" p="md" className={classes.chartCard}>
          <Title order={4} mb={4}>
            {dashboard.orderStatus}
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            {dashboard.orderStatusDesc}
          </Text>
          {orderStatusData.length > 0 ? (
            <Group align="center" justify="center" gap="xl" wrap="wrap">
              <DonutChart
                data={orderStatusData}
                withLabelsLine
                labelsType="percent"
                size={220}
                thickness={28}
                chartLabel={dashboard.ordersCount(stats.orders)}
              />
            </Group>
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              {dashboard.noOrders}
            </Text>
          )}
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Paper withBorder radius="md" p="md" className={classes.chartCard}>
          <Title order={4} mb={4}>
            {dashboard.productsByCategory}
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            {dashboard.productsByCategoryDesc}
          </Text>
          {productsByCategory.length > 0 ? (
            <BarChart
              h={280}
              data={productsByCategory}
              dataKey="category"
              series={[
                {
                  name: "products",
                  color: "indigo.6",
                  label: dashboard.productsLegend,
                },
              ]}
              tickLine="y"
              gridAxis="y"
              withBarValueLabel
            />
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              {dashboard.noProducts}
            </Text>
          )}
        </Paper>

        <Paper withBorder radius="md" p="md" className={classes.chartCard}>
          <Title order={4} mb={4}>
            {dashboard.ordersByStatus}
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            {dashboard.ordersByStatusDesc}
          </Text>
          {stats.orders > 0 ? (
            <BarChart
              h={280}
              data={orderStatusBars}
              dataKey="status"
              series={[
                {
                  name: "orders",
                  color: "blue.6",
                  label: dashboard.ordersLegend,
                },
              ]}
              tickLine="y"
              gridAxis="y"
              withBarValueLabel
            />
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              {dashboard.noOrders}
            </Text>
          )}
        </Paper>
      </SimpleGrid>
    </>
  );
};

export default Charts;
