import { SunIcon, MoonIcon } from '@phosphor-icons/react';
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

import cx from 'clsx';
import classes from './Mode.module.scss';

const Mode = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      size="lg"
      variant="default"
      aria-label="Toggle color scheme"
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
    >
      {computedColorScheme === 'light' ? (
        <SunIcon className={cx(classes.icon, classes.light)} />
      ) : (
        <MoonIcon className={cx(classes.icon, classes.dark)} />
      )}
    </ActionIcon>
  );
};

export default Mode;
