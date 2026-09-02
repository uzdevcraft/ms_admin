import { useMemo } from 'react';
import { Loader, Stack } from '@mantine/core';

import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import { dashboard as dashboardLocale } from '@/locale/uz';
import { useList as useCategoriesList } from '@/modules/categories/hooks';
import { useList as useOrdersList } from '@/modules/orders/hooks';
import { useList as useProductsList } from '@/modules/products/hooks';

import {
  buildDashboardStats,
  buildOrderStatusBarData,
  buildOrderStatusData,
  buildOrdersTrend,
  buildProductsByCategory,
  getRecentOrders
} from './analytics';
import { Charts, RecentOrders, Stats } from './components';

import classes from './Dashboard.module.scss';

const Dashboard = () => {
  const orders = useOrdersList();
  const products = useProductsList();
  const categories = useCategoriesList();

  const isLoading = products.isLoading || categories.isLoading || orders.isLoading;
  const isError = products.isError || categories.isError || orders.isError;
  const isFetching = products.isFetching || categories.isFetching || orders.isFetching;

  const productList = products.data?.data ?? [];
  const orderList = orders.data?.data ?? [];
  const categoryCount = categories.data?.data.length ?? 0;

  const stats = useMemo(
    () => buildDashboardStats(productList, categoryCount, orderList),
    [productList, categoryCount, orderList]
  );
  const ordersTrend = useMemo(() => buildOrdersTrend(orderList), [orderList]);
  const orderStatusData = useMemo(() => buildOrderStatusData(orderList), [orderList]);
  const orderStatusBars = useMemo(() => buildOrderStatusBarData(orderList), [orderList]);
  const productsByCategory = useMemo(() => buildProductsByCategory(productList), [productList]);
  const recentOrders = useMemo(() => getRecentOrders(orderList), [orderList]);

  const displayName = 'ZARO';

  const refetch = () => {
    void products.refetch();
    void categories.refetch();
    void orders.refetch();
  };

  return (
    <PageHeader title={dashboardLocale.welcome} description={dashboardLocale.overview}>
      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : isLoading ? (
        <div className={classes.loader}>
          <Loader color="blue" />
        </div>
      ) : (
        <Stack gap="md" className={classes.content}>
          <Stats stats={stats} />
          <Charts
            stats={stats}
            ordersTrend={ordersTrend}
            orderStatusData={orderStatusData}
            orderStatusBars={orderStatusBars}
            productsByCategory={productsByCategory}
          />
          <RecentOrders orders={recentOrders} />
        </Stack>
      )}
    </PageHeader>
  );
};

export default Dashboard;
