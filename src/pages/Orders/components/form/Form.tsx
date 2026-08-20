import type { Control, FieldErrors } from "react-hook-form";

import { UpdateStatusFormFields } from "@/modules/orders/forms";
import type { UpdateStatusFormValues } from "@/modules/orders/forms";

type IProps = {
  control: Control<UpdateStatusFormValues>;
  errors: FieldErrors<UpdateStatusFormValues>;
};

export default function Form({ control, errors }: IProps) {
  return <UpdateStatusFormFields control={control} errors={errors} />;
}
