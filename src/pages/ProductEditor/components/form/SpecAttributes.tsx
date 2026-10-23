import { Alert, Button, Center, Loader, SimpleGrid, Text } from '@mantine/core';
import { IconBolt, IconInfoCircle } from '@tabler/icons-react';
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

/** Section 02: spec attributes from `GET /attribute-definition` with their options. */
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
      <Center py="lg" className={classes.loading}>
        <Loader size="sm" />
        <Text size="sm" c="dimmed">
          {productEditor.specsLoading}
        </Text>
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Alert color="red" variant="light" title={productEditor.specsError}>
        <Button size="compact-sm" variant="light" color="red" onClick={onRetry}>
          {productEditor.retry}
        </Button>
      </Alert>
    );
  }

  return (
    <>
      <div className={classes.banner}>
        <IconBolt size={18} className={classes.bannerIcon} />
        <span>{productEditor.specsBanner}</span>
      </div>

      {data.specs.length ? (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" verticalSpacing="lg">
          {data.specs.map(attribute => (
            <AttributeField key={attribute.id} attribute={attribute} />
          ))}
        </SimpleGrid>
      ) : (
        <Text size="sm" c="dimmed">
          {productEditor.specsEmpty}
        </Text>
      )}
    </>
  );
};

export default SpecAttributes;
