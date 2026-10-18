import { ActionIcon, Table, Text, Tooltip } from '@mantine/core';
import { IconCopyCheck, IconTrash } from '@tabler/icons-react';
import type { FieldArrayWithId } from 'react-hook-form';

import { formatPrice } from '@common/utils';
import * as Fields from '@/containers/Fields';
import { productEditor } from '@/locale/uz';
import type { CreateFormValues } from '@modules/products/forms';

import MoneyInput from './MoneyInput';
import classes from './Form.module.css';

type IProps = {
  fields: FieldArrayWithId<CreateFormValues, 'variants', '_id'>[];
  basePrice: number;
  onRemove: (index: number) => void;
  /** Copies the default stock into every row. */
  onApplyStock: () => void;
};

const VariantTable = ({ fields, basePrice, onRemove, onApplyStock }: IProps) => (
  <div className={classes.variantTable}>
    <Table verticalSpacing="xs" horizontalSpacing="md" miw={640} striped={false}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{productEditor.variant}</Table.Th>
          <Table.Th>{productEditor.sku}</Table.Th>
          <Table.Th w={180}>{productEditor.variantPrice}</Table.Th>
          <Table.Th w={150}>
            {productEditor.variantStock}
            <Tooltip label={productEditor.applyToAll} withArrow>
              <ActionIcon
                variant="subtle"
                size="sm"
                ml={4}
                onClick={onApplyStock}
                aria-label={productEditor.applyToAll}
              >
                <IconCopyCheck size={14} />
              </ActionIcon>
            </Tooltip>
          </Table.Th>
          <Table.Th w={48} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {fields.map((field, index) => (
          <Table.Tr key={field._id}>
            <Table.Td>
              <Text size="sm" fw={500}>
                {field.label}
              </Text>
            </Table.Td>
            <Table.Td>
              <Fields.Text name={`variants.${index}.sku`} size="sm" aria-label={productEditor.sku} />
            </Table.Td>
            <Table.Td>
              <MoneyInput
                name={`variants.${index}.price`}
                size="sm"
                nullable
                placeholder={basePrice ? formatPrice(basePrice) : undefined}
                aria-label={productEditor.variantPrice}
              />
            </Table.Td>
            <Table.Td>
              <MoneyInput
                name={`variants.${index}.stockQuantity`}
                size="sm"
                keepZero
                unit={productEditor.pieces}
                aria-label={productEditor.variantStock}
              />
            </Table.Td>
            <Table.Td>
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => onRemove(index)}
                aria-label={productEditor.removeVariant}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </div>
);

export default VariantTable;
