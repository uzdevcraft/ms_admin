import { Switch as MantineSwitch, type SwitchProps } from "@mantine/core";

import classes from "./Switch.module.scss";

const Switch = (props: SwitchProps) => {
  return (
    <MantineSwitch
      classNames={{ track: classes.track, thumb: classes.thumb }}
      withThumbIndicator={false}
      {...props}
    />
  );
};

export default Switch;
