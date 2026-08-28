import {
  Group,
  NumberInput,
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
import { forms } from "@/locale/uz";
import type { CategoryFormValues } from "./schema";

interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryFormValues>;
  control: Control<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
  showId?: boolean;
}

export function CategoryFormFields({
  register,
  control,
  errors,
  showId = false,
}: CategoryFormFieldsProps) {
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
        minRows={3}
        error={errors.description?.message}
        {...register("description")}
      />

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
