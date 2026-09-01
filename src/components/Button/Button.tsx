import type { ReactNode } from 'react';
import { Button as MantineButton, type ButtonProps, type ElementProps } from '@mantine/core';

// `ButtonProps` only covers Mantine's styling props. Native button attributes
// (type, onClick, form, ...) come from `ElementProps`, which is what Mantine's
// own polymorphic factory composes internally.
interface IProps extends ButtonProps, ElementProps<'button', keyof ButtonProps | 'title'> {
  title: ReactNode;
}

const Button = ({ title, ...props }: IProps) => {
  return <MantineButton {...props}>{title}</MantineButton>;
};

export default Button;
