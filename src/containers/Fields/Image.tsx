// import type { ComponentProps } from 'react';

// import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

// import { ImageUpload } from '@/components/ImageUpload';

// type IProps<T extends FieldValues> = UseControllerProps<T> &
//   Omit<ComponentProps<typeof ImageUpload>, 'value' | 'onChange' | 'error'>;

// /**
//  * Image field: picks a file, uploads it, then keeps the returned URL as the
//  * field value and previews it. The form value is always the image URL string.
//  */
// export function ImageField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
//   const {
//     field,
//     fieldState: { error }
//   } = useController<T>({
//     name,
//     control,
//     rules,
//     defaultValue
//   });

//   return (
//     <ImageUpload
//       {...rest}
//       value={typeof field.value === 'string' ? field.value : ''}
//       onChange={field.onChange}
//       error={error?.message}
//     />
//   );
// }

// export default ImageField;

import { type ComponentProps } from 'react';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

import { ImageUpload } from '@/components/ImageUpload';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<ComponentProps<typeof ImageUpload>, 'value' | 'onChange' | 'error'>;

export function ImageField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue
  });

  return (
    <ImageUpload
      {...rest}
      value={typeof field.value === 'string' ? field.value : ''}
      onChange={field.onChange}
      error={error?.message}
    />
  );
}

export default ImageField;
