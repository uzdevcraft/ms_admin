import { Alert, Button, Group, Loader, SimpleGrid, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import cx from 'clsx';

import { productEditor } from '@/locale/uz';
import type * as Attributes from '@/modules/attributes/types';

import AttributeField from './AttributeField';
import classes from './Form.module.css';

type IProps = {
  categoryId: number;
  data?: Attributes.IQuery.CategoryAttributes;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

/**
 * Section 02: spec (non-variant) attributes of the category template from
 * `GET /categories/{id}/attributes`; saved with `PUT /seller/products/specs/{id}`.
 */
const SpecAttributes = ({ categoryId, data, isLoading, isError, onRetry }: IProps) => {
  if (!categoryId) {
    return (
      <div className={cx(classes.banner, classes.bannerMuted)}>
        <IconInfoCircle size={18} className={classes.bannerIcon} />
        {productEditor.specsChooseCategory}
      </div>
    );
  }

  if (isLoading) {
    return (
      <Group gap="xs" className={classes.loading}>
        <Loader size="xs" />
        <Text size="sm" c="dimmed">
          {productEditor.templateLoading}
        </Text>
      </Group>
    );
  }

  if (isError || !data) {
    return (
      <Alert color="red" variant="light" title={productEditor.templateError}>
        <Button size="compact-sm" variant="light" color="red" onClick={onRetry}>
          {productEditor.retry}
        </Button>
      </Alert>
    );
  }

  if (!data.specs.length) {
    return (
      <Text size="sm" c="dimmed">
        {data.templateId ? productEditor.specsEmpty : productEditor.templateMissing}
      </Text>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" verticalSpacing="lg">
      {data.specs.map(attribute => (
        <AttributeField key={attribute.id} attribute={attribute} />
      ))}
    </SimpleGrid>
  );
};

export default SpecAttributes;
