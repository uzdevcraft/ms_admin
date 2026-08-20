import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { CategoryFormFields } from "@/modules/categories/forms";
import type { CategoryFormValues } from "@/modules/categories/forms";

type IProps<T extends CategoryFormValues> = {
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  showId?: boolean;
};

export default function Form<T extends CategoryFormValues>({
  register,
  control,
  errors,
  showId,
}: IProps<T>) {
  return (
    <CategoryFormFields
      register={register as unknown as UseFormRegister<CategoryFormValues>}
      control={control as unknown as Control<CategoryFormValues>}
      errors={errors as unknown as FieldErrors<CategoryFormValues>}
      showId={showId}
    />
  );
}
