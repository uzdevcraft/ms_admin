import { Alert, Stack, Switch, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { productEditor } from '@/locale/uz';
import type { CreateFormValues } from '@modules/products/forms';

import classes from './Form.module.css';

const CHANNELS = [
  { name: 'onlineEnabled', title: productEditor.online, hint: productEditor.onlineHint },
  { name: 'storeEnabled', title: productEditor.store, hint: productEditor.storeHint }
] as const;

/** Section 05: where the product is sold. */
const Channels = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<CreateFormValues>();
  const online = useWatch({ control, name: 'onlineEnabled' });

  return (
    <Stack gap="md">
      <div className={classes.channels}>
        {CHANNELS.map(channel => (
          <div key={channel.name} className={classes.channel}>
            <div>
              <Text className={classes.channelTitle}>{channel.title}</Text>
              <Text className={classes.channelHint}>{channel.hint}</Text>
            </div>
            <Controller
              control={control}
              name={channel.name}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={event => field.onChange(event.currentTarget.checked)}
                  aria-label={channel.title}
                />
              )}
            />
          </div>
        ))}
      </div>

      {errors.storeEnabled?.message && (
        <Text size="sm" c="red">
          {errors.storeEnabled.message}
        </Text>
      )}

      <Text size="sm" c="dimmed">
        {productEditor.channelsNote}
      </Text>

      {online && (
        <Alert color="blue" variant="light" icon={<IconInfoCircle size={18} />}>
          {productEditor.onlineAlert}
        </Alert>
      )}
    </Stack>
  );
};

export default Channels;
