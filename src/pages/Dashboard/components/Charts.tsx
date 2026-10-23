import type { ReactNode } from 'react';
import { AreaChart, BarChart, DonutChart, type DonutChartCell } from '@mantine/charts';
import { Grid, Paper, Text, Title } from '@mantine/core';

import { dashboard } from '@/locale/uz';

import type { DashboardStats, OrderStatusBarPoint, OrdersTrendPoint, ProductsByCategoryPoint } from '../analytics';
import classes from '../Dashboard.module.scss';

type IProps = {
  stats: DashboardStats;
  ordersTrend: OrdersTrendPoint[];
  orderStatusData: DonutChartCell[];
  orderStatusBars: OrderStatusBarPoint[];
  productsByCategory: ProductsByCategoryPoint[];
};

const compact = (value: number) => (value >= 1000 ? `${Math.round(value / 1000)}k` : String(value));

/** "yellow.6" → the matching Mantine CSS variable, for legend swatches. */
const colorVar = (color: string) => `var(--mantine-color-${color.replace('.', '-')})`;

const ChartCard = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <Paper withBorder p="lg" className={classes.chartCard}>
    <div className={classes.cardHeader}>
      <Title order={4} className={classes.cardTitle}>
        {title}
      </Title>
      <Text className={classes.cardDescription}>{description}</Text>
    </div>
    <div className={classes.chartBody}>{children}</div>
  </Paper>
);

const Empty = ({ children }: { children: ReactNode }) => <Text className={classes.empty}>{children}</Text>;

const Charts = ({ stats, ordersTrend, orderStatusData, orderStatusBars, productsByCategory }: IProps) => {
  const statusTotal = orderStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Grid gap="md">
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <ChartCard title={dashboard.ordersRevenue} description={dashboard.ordersRevenueDesc}>
          {/* Orders (count) and revenue (UZS) have very different scales: two axes keep both readable. */}
          <AreaChart
            h={280}
            data={ordersTrend}
            dataKey="date"
            series={[
              { name: 'orders', color: 'blue.6', label: dashboard.ordersLegend },
              { name: 'revenue', color: 'teal.6', label: dashboard.revenueLegend, yAxisId: 'right' }
            ]}
            curveType="monotone"
            withLegend
            legendProps={{ verticalAlign: 'top', height: 36 }}
            withDots={false}
            withRightYAxis
            gridAxis="x"
            tickLine="none"
            strokeDasharray="4 4"
            fillOpacity={0.18}
            yAxisProps={{ allowDecimals: false, width: 32 }}
            rightYAxisProps={{ tickFormatter: compact, width: 48 }}
            valueFormatter={value => (value >= 1000 ? `${Math.round(value / 1000)}k` : String(value))}
          />
        </ChartCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 4 }}>
        <ChartCard title={dashboard.orderStatus} description={dashboard.orderStatusDesc}>
          {orderStatusData.length > 0 ? (
            <div className={classes.donutLayout}>
              <DonutChart
                data={orderStatusData}
                size={176}
                thickness={20}
                paddingAngle={2}
                chartLabel={dashboard.ordersCount(stats.orders)}
                classNames={{ label: classes.donutLabel }}
              />
              <ul className={classes.legend}>
                {orderStatusData.map(item => (
                  <li key={item.name} className={classes.legendItem}>
                    <span className={classes.legendSwatch} style={{ background: colorVar(item.color) }} />
                    <span className={classes.legendName}>{item.name}</span>
                    <span className={classes.legendValue}>{item.value}</span>
                    <span className={classes.legendShare}>
                      {statusTotal ? Math.round((item.value / statusTotal) * 100) : 0}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Empty>{dashboard.noOrders}</Empty>
          )}
        </ChartCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 6 }}>
        <ChartCard title={dashboard.productsByCategory} description={dashboard.productsByCategoryDesc}>
          {productsByCategory.length > 0 ? (
            <BarChart
              h={260}
              data={productsByCategory}
              dataKey="category"
              series={[{ name: 'products', color: 'blue.5', label: dashboard.productsLegend }]}
              tickLine="none"
              gridAxis="x"
              strokeDasharray="4 4"
              maxBarWidth={44}
              barProps={{ radius: [6, 6, 0, 0] }}
              yAxisProps={{ allowDecimals: false, width: 32 }}
              withBarValueLabel
            />
          ) : (
            <Empty>{dashboard.noProducts}</Empty>
          )}
        </ChartCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 6 }}>
        <ChartCard title={dashboard.ordersByStatus} description={dashboard.ordersByStatusDesc}>
          {stats.orders > 0 ? (
            <BarChart
              h={260}
              data={orderStatusBars}
              dataKey="status"
              series={[{ name: 'orders', color: 'blue.6', label: dashboard.ordersLegend }]}
              tickLine="none"
              gridAxis="x"
              strokeDasharray="4 4"
              maxBarWidth={44}
              barProps={{ radius: [6, 6, 0, 0] }}
              yAxisProps={{ allowDecimals: false, width: 32 }}
              withBarValueLabel
            />
          ) : (
            <Empty>{dashboard.noOrders}</Empty>
          )}
        </ChartCard>
      </Grid.Col>
    </Grid>
  );
};

export default Charts;
