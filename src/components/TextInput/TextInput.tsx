import { TextInput as MantineTextInput } from '@mantine/core';

import * as Types from './internal/types';

import classes from './TextInput.module.scss';

export const TextInput = ({
  size = 'md',
  inputWrapperOrder = ['label', 'input', 'description', 'error'],
  ...props
}: Types.IBase.IProps) => {
  return (
    <MantineTextInput
      size={size}
      classNames={{
        root: classes.root,
        input: classes.input,
        error: classes.error,
        label: classes.label,
        wrapper: classes.wrapper,
        description: classes.description
      }}
      inputWrapperOrder={inputWrapperOrder}
      {...props}
    />
  );
};

export default TextInput;
