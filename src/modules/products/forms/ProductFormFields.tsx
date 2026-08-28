import {
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { ImageUpload } from "@/components/ImageUpload";
import { Hooks as CategoryHooks } from "@modules/categories";
import { forms } from "@/locale/uz";
import type { ProductFormValues } from "./schema";

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  showId?: boolean;
}

export function ProductFormFields({
  register,
  control,
  errors,
  showId = false,
}: ProductFormFieldsProps) {
  const { data: categories } = CategoryHooks.useList();

  const categoryOptions =
    categories?.data.map((category) => ({
      value: String(category.id),
      label: category.name,
    })) ?? [];

  return (
    <Stack gap="sm">
      {showId ? (
        <Controller
          name="id"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={forms.id}
              min={1}
              allowDecimal={false}
              error={errors.id?.message}
              value={field.value || undefined}
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
      ) : null}

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select
            label={forms.category}
            data={categoryOptions}
            error={errors.categoryId?.message}
            value={field.value ? String(field.value) : null}
            onChange={(value) => field.onChange(Number(value) || 0)}
          />
        )}
      />

      <Group grow>
        <TextInput
          label={forms.name}
          error={errors.name?.message}
          {...register("name")}
        />
        <TextInput
          label={forms.nameUz}
          error={errors.nameUz?.message}
          {...register("nameUz")}
        />
        <TextInput
          label={forms.nameRu}
          error={errors.nameRu?.message}
          {...register("nameRu")}
        />
      </Group>

      <Textarea
        label={forms.description}
        minRows={2}
        error={errors.description?.message}
        {...register("description")}
      />
      <Group grow>
        <Textarea
          label={forms.descriptionUz}
          minRows={2}
          error={errors.descriptionUz?.message}
          {...register("descriptionUz")}
        />
        <Textarea
          label={forms.descriptionRu}
          minRows={2}
          error={errors.descriptionRu?.message}
          {...register("descriptionRu")}
        />
      </Group>

      <Group grow>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={forms.price}
              decimalScale={2}
              min={0}
              error={errors.price?.message}
              value={field.value}
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
        <Controller
          name="discountPrice"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={forms.discountPrice}
              decimalScale={2}
              min={0}
              error={errors.discountPrice?.message}
              value={field.value}
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
      </Group>

      <Group grow>
        <Controller
          name="stockQuantity"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={forms.stock}
              min={0}
              error={errors.stockQuantity?.message}
              value={field.value}
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
        <Controller
          name="sortOrder"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={forms.sortOrder}
              min={0}
              error={errors.sortOrder?.message}
              value={field.value}
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
      </Group>

      <Controller
        name="imageUrl"
        control={control}
        render={({ field }) => (
          <ImageUpload
            label={forms.imageUrl}
            placeholder={forms.imagePlaceholder}
            value={field.value || ""}
            onChange={field.onChange}
            error={errors.imageUrl?.message}
          />
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <Switch
            label={forms.activeVisible}
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
    </Stack>
  );
}
