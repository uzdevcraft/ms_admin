import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { clearUserToken, getUserToken, setUserToken } from "@common/services";
import formatPrice from "@common/utils/formatPrice";
import getApiError from "@common/utils/getApiError";
import {
  createDefaultValues,
  createOrderSchema,
  type CreateOrderFormValues,
} from "@modules/orders/forms/schema";
import { Hooks as UserHooks } from "@modules/user";
import { OrderStatusBadge } from "../../components/common/StatusBadge";
import { ResponsiveTable } from "../../components/common/ResponsiveTable";
import { PageHeader } from "../../components/common/PageHeader";
import { formatDate } from "../../utils/format";

export function UserTestingPage() {
  const queryClient = useQueryClient();
  const [tokenInput, setTokenInput] = useState(getUserToken());
  const [telegramId, setTelegramId] = useState<number | string>("");
  const [tokenActive, setTokenActive] = useState(() => !!getUserToken());
  const login = UserHooks.useLogin();
  const profile = UserHooks.useMe();
  const products = UserHooks.useListProducts();
  const myOrders = UserHooks.useMyOrders();
  const createOrder = UserHooks.useCreateOrder();
  const createPayment = UserHooks.useCreatePayment();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateOrderFormValues>({
    resolver: yupResolver(createOrderSchema),
    defaultValues: createDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const invalidateUserQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const handleApplyToken = () => {
    const token = tokenInput.trim();
    if (!token) {
      notifications.show({ message: "Paste a user token first", color: "red" });
      return;
    }
    setUserToken(token);
    setTokenActive(true);
    invalidateUserQueries();
    notifications.show({ message: "User token saved", color: "green" });
  };

  const handleClearToken = () => {
    clearUserToken();
    setTokenInput("");
    setTokenActive(false);
    invalidateUserQueries();
    notifications.show({ message: "User token cleared", color: "gray" });
  };

  const handleTelegramLogin = async () => {
    const id = Number(telegramId);
    if (!id) {
      notifications.show({
        message: "Enter a valid Telegram ID",
        color: "red",
      });
      return;
    }

    try {
      const data = await login.mutateAsync(id);
      setTokenInput(data.token);
      setTokenActive(true);
      invalidateUserQueries();
      notifications.show({ message: "Logged in as user", color: "green" });
    } catch (error) {
      const apiError = getApiError(error);
      notifications.show({
        message: apiError.message || "Login failed",
        color: "red",
      });
    }
  };

  const handlePlaceOrder = async (values: CreateOrderFormValues) => {
    try {
      await createOrder.mutateAsync(values);
      notifications.show({ message: "Order placed", color: "green" });
      reset(createDefaultValues);
    } catch (error) {
      const apiError = getApiError(error);
      notifications.show({
        message: apiError.message || "Only users can place orders",
        color: "red",
      });
    }
  };

  const handleCreatePayment = async (orderId: number) => {
    try {
      const payment = await createPayment.mutateAsync(orderId);
      notifications.show({
        message: payment.paymentUrl
          ? "Payment created"
          : "Payment request sent",
        color: "green",
      });
    } catch (error) {
      const apiError = getApiError(error);
      notifications.show({
        message: apiError.message || "Payment failed",
        color: "red",
      });
    }
  };

  const productOptions =
    products.data?.data.map((product) => ({
      value: String(product.id),
      label: product.name,
    })) ?? [];

  return (
    <Stack gap="lg">
      <PageHeader
        title="User API Testing"
        description="Test customer endpoints with a user JWT. Only regular users can place orders."
      />

      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="sm">
          User token
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Paste a customer token or log in via Telegram ID. Requests on this
          page use this token, not the admin session.
        </Text>
        <Stack gap="sm">
          <Textarea
            label="Bearer token"
            placeholder="eyJhbGciOiJIUzI1NiJ9..."
            minRows={3}
            value={tokenInput}
            onChange={(event) => setTokenInput(event.currentTarget.value)}
          />
          <Group>
            <Button onClick={handleApplyToken}>Save token</Button>
            <Button variant="default" onClick={handleClearToken}>
              Clear
            </Button>
            {tokenActive && (
              <Badge color="green" variant="light">
                Token active
              </Badge>
            )}
          </Group>
          <Group align="flex-end">
            <NumberInput
              label="Or login with Telegram ID"
              placeholder="958536406"
              value={telegramId}
              onChange={setTelegramId}
              style={{ flex: 1 }}
            />
            <Button loading={login.isPending} onClick={handleTelegramLogin}>
              Get token
            </Button>
          </Group>
        </Stack>
      </Paper>

      {!tokenActive ? (
        <Card withBorder p="xl" radius="md">
          <Text ta="center" c="dimmed">
            Save a user token to load profile, products, orders, and place
            orders.
          </Text>
        </Card>
      ) : (
        <>
          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="sm">
              GET /auth/me
            </Title>
            {profile.isLoading ? (
              <Loader size="sm" color="violet" />
            ) : profile.data ? (
              <Stack gap={4}>
                <Text size="sm">
                  <strong>{profile.data.firstName}</strong> (@
                  {profile.data.username})
                </Text>
                <Text size="sm" c="dimmed">
                  Telegram ID: {profile.data.telegramId} · Phone:{" "}
                  {profile.data.phoneNumber}
                </Text>
                <Group gap="xs">
                  <Badge variant="light">{profile.data.role}</Badge>
                  <Badge
                    color={profile.data.isActive ? "green" : "gray"}
                    variant="light"
                  >
                    {profile.data.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Group>
              </Stack>
            ) : (
              <Text size="sm" c="red">
                Could not load profile
              </Text>
            )}
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="sm">
              GET /products
            </Title>
            {products.isLoading ? (
              <Loader size="sm" color="violet" />
            ) : (
              <ResponsiveTable striped highlightOnHover withTableBorder minWidth={640}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Stock</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(products.data?.data ?? []).map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>{product.id}</Table.Td>
                      <Table.Td>{product.name}</Table.Td>
                      <Table.Td>{product.categoryName}</Table.Td>
                      <Table.Td>
                        {formatPrice(product.effectivePrice || product.price)}
                      </Table.Td>
                      <Table.Td>{product.stockQuantity}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </ResponsiveTable>
            )}
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="sm">
              POST /orders
            </Title>
            <form onSubmit={handleSubmit(handlePlaceOrder)}>
              <Stack gap="sm">
                {fields.map((field, index) => (
                  <Group key={field.id} align="flex-end" grow>
                    <Controller
                      name={`items.${index}.productId`}
                      control={control}
                      render={({ field: productField }) => (
                        <Select
                          label={index === 0 ? "Product" : undefined}
                          data={productOptions}
                          searchable
                          error={errors.items?.[index]?.productId?.message}
                          value={
                            productField.value
                              ? String(productField.value)
                              : null
                          }
                          onChange={(value) =>
                            productField.onChange(Number(value) || 0)
                          }
                        />
                      )}
                    />
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field: quantityField }) => (
                        <NumberInput
                          label={index === 0 ? "Quantity" : undefined}
                          min={1}
                          error={errors.items?.[index]?.quantity?.message}
                          value={quantityField.value}
                          onChange={(value) =>
                            quantityField.onChange(Number(value) || 1)
                          }
                        />
                      )}
                    />
                    {fields.length > 1 && (
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => remove(index)}
                        aria-label="Remove item"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                ))}

                {typeof errors.items?.message === "string" && (
                  <Text size="sm" c="red">
                    {errors.items.message}
                  </Text>
                )}

                <Button
                  type="button"
                  variant="light"
                  color="violet"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => append({ productId: 0, quantity: 1 })}
                >
                  Add item
                </Button>

                <TextInput
                  label="Delivery address"
                  error={errors.deliveryAddress?.message}
                  {...register("deliveryAddress")}
                />
                <Textarea
                  label="Comment"
                  minRows={2}
                  {...register("comment")}
                />

                <Group justify="flex-end">
                  <Button
                    type="submit"
                    color="violet"
                    loading={createOrder.isPending}
                  >
                    Place order
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Title order={4} mb="sm">
              GET /orders/my-orders
            </Title>
            {myOrders.isLoading ? (
              <Loader size="sm" color="violet" />
            ) : (
              <ResponsiveTable striped highlightOnHover withTableBorder minWidth={840}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Order #</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Payment</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(myOrders.data?.data ?? []).map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>#{order.id}</Table.Td>
                      <Table.Td>
                        {order.items.length > 0
                          ? order.items
                              .map(
                                (item) =>
                                  `${item.productName} ×${item.quantity}`,
                              )
                              .join(", ")
                          : "—"}
                      </Table.Td>
                      <Table.Td>{formatPrice(order.totalAmount)}</Table.Td>
                      <Table.Td>
                        <OrderStatusBadge status={order.status} />
                      </Table.Td>
                      <Table.Td>{formatDate(order.createdAt)}</Table.Td>
                      <Table.Td>
                        {order.payment?.paymentUrl ? (
                          <Button
                            component="a"
                            href={order.payment.paymentUrl}
                            target="_blank"
                            rel="noreferrer"
                            size="xs"
                            variant="light"
                          >
                            Pay
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="light"
                            loading={createPayment.isPending}
                            onClick={() => handleCreatePayment(order.id)}
                          >
                            Create payment
                          </Button>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </ResponsiveTable>
            )}
          </Paper>
        </>
      )}
    </Stack>
  );
}
