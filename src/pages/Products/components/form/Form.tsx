import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { ProductFormFields } from "@/modules/products/forms";
import type { ProductFormValues } from "@/modules/products/forms";

type IProps<T extends ProductFormValues> = {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  showId?: boolean;
};

export default function Form<T extends ProductFormValues>({
  register,
  control,
  errors,
  showId,
}: IProps<T>) {
  return (
    <ProductFormFields
      register={register as unknown as UseFormRegister<ProductFormValues>}
      control={control as unknown as Control<ProductFormValues>}
      errors={errors as unknown as FieldErrors<ProductFormValues>}
      showId={showId}
    />
  );
}
