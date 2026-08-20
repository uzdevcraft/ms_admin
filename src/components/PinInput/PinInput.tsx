import { PinInput as MantinePinInput } from '@mantine/core';

import * as Types from './internal/types';

import classes from './PinInput.module.scss';

export const PinInput = ({ size = 'md', placeholder = '○', ...props }: Types.IBase.IProps) => {
  return (
    <MantinePinInput
      size={size}
      classNames={{
        root: classes.root,
        input: classes.input,
        pinInput: classes.pinInput
      }}
      {...props}
    />
  );
};

export default PinInput;
