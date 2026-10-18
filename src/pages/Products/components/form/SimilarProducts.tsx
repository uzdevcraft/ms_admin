import { Avatar, Button, Paper, Text, Tooltip } from '@mantine/core';
import { IconCopy } from '@tabler/icons-react';

import { formatPrice, mediaUrl } from '@common/utils';
import { productSuggestions } from '@/locale/uz';
import type * as Types from '@/modules/products/types';

import classes from './Form.module.css';

type IProps = {
  products: Types.IEntity.Product[];
  onCopy: (product: Types.IEntity.Product) => void;
  limit?: number;
};

const SimilarProducts = ({ products, onCopy, limit = 4 }: IProps) => {
  if (!products.length) return null;

  return (
    <Paper withBorder radius="md" className={classes.similar}>
      <Text size="xs" fw={600} c="dimmed" tt="uppercase">
        {productSuggestions.similarTitle}
      </Text>
      {products.slice(0, limit).map(product => (
        <div key={product.id} className={classes.similarItem}>
          <Avatar src={mediaUrl(product.imageUrl) || null} radius="sm" size={36}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className={classes.similarText}>
            <Text size="sm" fw={500} truncate>
              {product.name}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {[product.categoryName, product.price ? formatPrice(product.price) : null].filter(Boolean).join(' · ')}
            </Text>
          </div>
          <Tooltip label={productSuggestions.copyHint} withArrow>
            <Button
              size="compact-xs"
              variant="light"
              leftSection={<IconCopy size={14} />}
              onClick={() => onCopy(product)}
            >
              {productSuggestions.copy}
            </Button>
          </Tooltip>
        </div>
      ))}
    </Paper>
  );
};

export default SimilarProducts;
