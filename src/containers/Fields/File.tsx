import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

import { FileInput, type FileInputProps } from "@mantine/core";

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<FileInputProps, "name" | "value" | "onChange" | "error">;

export function FileField<T extends FieldValues>({
  control,
  name,
  rules,
  defaultValue,
  placeholder,
  ...rest
}: IProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue,
  });

  // Mantine renders the placeholder only when the value is exactly `null`.
  // The form's empty state is `""`, which `?? null` leaves untouched — so it
  // used to render an empty value element instead of the placeholder.
  const value: unknown = field.value;
  const file = value instanceof File ? value : null;

  // A value that is already saved is a URL string rather than a `File`;
  // show it in place of the placeholder so the field isn't misleadingly empty.
  const currentUrl = typeof value === "string" ? value : "";

  return (
    <FileInput
      {...rest}
      name={field.name}
      value={file}
      ref={field.ref}
      onBlur={field.onBlur}
      onChange={field.onChange}
      error={error?.message}
      placeholder={currentUrl || placeholder}
    />
  );
}

export default FileField;
