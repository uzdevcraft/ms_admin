import { Switch } from "@/components/Switch";
import { type SwitchProps } from "@mantine/core";

import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

type IProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> &
  Omit<SwitchProps, "name" | "value" | "onChange" | "error">;

export function SwitchField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  defaultValue,
  ...rest
}: IProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController<TFieldValues, TName>({
    name,
    control,
    rules,
    defaultValue,
  });

  return (
    <Switch
      {...rest}
      {...field}
      error={error?.message}
      checked={!!field.value}
      withThumbIndicator={rest.withThumbIndicator || false}
    />
  );
}

export default SwitchField;
