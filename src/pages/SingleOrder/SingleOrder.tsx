import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Anchor, Badge, Card, Grid, Group, Image, Loader, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import { Table } from '@/components/Table';
import formatPrice from '@common/utils/formatPrice';
import { common, orders as ordersLocale, paymentStatus as paymentStatusLocale } from '@/locale/uz';
import { useSingle } from '@/modules/orders/hooks';
import { STATUS_COLORS, STATUS_LABELS } from '@/pages/Orders/columns';

import { getOrderItemColumns } from './columns';

import classes from './SingleOrder.module.scss';

type InfoProps = {
  label: string;
  value: ReactNode;
};

const Info = ({ label, value }: InfoProps) => (
  <Group justify="space-between" align="flex-start" wrap="nowrap" gap="lg">
    <Text className={classes.label}>{label}</Text>
    <Text component="div" className={classes.value}>
      {value || common.dash}
    </Text>
  </Group>
);

const SingleOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = Number(id);

  const { data: order, isLoading, isError, refetch, isFetching } = useSingle({ id: orderId });

  const columns = useMemo(() => getOrderItemColumns(), []);

  return (
    <PageHeader
      title={ordersLocale.single(orderId)}
      description={ordersLocale.singleDescription}
      actions={
        <Button
          variant="default"
          leftSection={<IconArrowLeft size={16} />}
          title={ordersLocale.back}
          onClick={() => navigate('/orders')}
        />
      }
    >
      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : isLoading ? (
        <div className={classes.loader}>
          <Loader color="blue" />
        </div>
      ) : !order ? (
        <Text c="dimmed">{ordersLocale.notFound}</Text>
      ) : (
        <Stack gap="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card className={classes.card} padding="lg" radius="md" withBorder>
                <Stack gap="sm">
                  <Title order={5}>{ordersLocale.orderInfo}</Title>

                  <Info label={ordersLocale.orderNumber} value={`#${order.id}`} />
                  <Info
                    label={ordersLocale.status}
                    value={
                      <Badge color={STATUS_COLORS[order.status]} radius="sm" variant="outline">
                        {STATUS_LABELS[order.status] || order.status}
                      </Badge>
                    }
                  />
                  <Info label={ordersLocale.customer} value={order.userFullName} />
                  <Info label={ordersLocale.customerId} value={order.userId || common.dash} />
                  <Info label={ordersLocale.delivery} value={order.deliveryAddress} />
                  <Info label={ordersLocale.comment} value={order.comment} />
                  <Info
                    label={ordersLocale.date}
                    value={order.createdAt ? dayjs(order.createdAt).format('DD/MM/YYYY HH:mm') : common.dash}
                  />
                  <Info label={ordersLocale.total} value={formatPrice(order.totalAmount)} />
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card className={classes.card} padding="lg" radius="md" withBorder>
                <Stack gap="sm">
                  <Title order={5}>{ordersLocale.paymentInfo}</Title>

                  {order.payment ? (
                    <>
                      <Info label={ordersLocale.orderNumber} value={`#${order.payment.id}`} />
                      <Info
                        label={ordersLocale.status}
                        value={
                          <Badge color={order.payment.status === 'PAID' ? 'green' : 'gray'} radius="sm" variant="light">
                            {paymentStatusLocale[order.payment.status] || order.payment.status}
                          </Badge>
                        }
                      />
                      <Info label={ordersLocale.paymentAmount} value={formatPrice(order.payment.amount)} />
                      <Info label={ordersLocale.merchantTransId} value={order.payment.merchantTransId} />
                      <Info
                        label={ordersLocale.date}
                        value={
                          order.payment.createdAt
                            ? dayjs(order.payment.createdAt).format('DD/MM/YYYY HH:mm')
                            : common.dash
                        }
                      />
                      {order.payment.paymentUrl ? (
                        <Info
                          label={ordersLocale.paymentUrl}
                          value={
                            <Anchor href={order.payment.paymentUrl} target="_blank" rel="noreferrer" size="sm">
                              {ordersLocale.openPaymentUrl}
                            </Anchor>
                          }
                        />
                      ) : null}

                      <Stack gap={6} mt="xs">
                        <Text className={classes.label}>{ordersLocale.receipt}</Text>

                        {order.payment.receiptImageUrl ? (
                          <Anchor href={order.payment.receiptImageUrl} target="_blank" rel="noreferrer">
                            <Image
                              src={order.payment.receiptImageUrl}
                              alt={ordersLocale.receipt}
                              className={classes.receipt}
                              fit="contain"
                              radius="md"
                            />
                          </Anchor>
                        ) : (
                          <Text c="dimmed" size="sm">
                            {ordersLocale.noReceipt}
                          </Text>
                        )}
                      </Stack>
                    </>
                  ) : (
                    <Text c="dimmed" size="sm">
                      {ordersLocale.noPayment}
                    </Text>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          <Card className={classes.card} padding="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Title order={5}>{ordersLocale.items}</Title>

              <Table
                columns={columns}
                data={order.items}
                emptyMessage={ordersLocale.noItems}
                rowKey={item => item.id}
                minWidth={640}
              />
            </Stack>
          </Card>
        </Stack>
      )}
    </PageHeader>
  );
};

export default SingleOrder;
