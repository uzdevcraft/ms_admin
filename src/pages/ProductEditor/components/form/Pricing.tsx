import type { ReactNode } from 'react';
import { Badge, Button, Group, Input, Stack, Switch, Text } from '@mantine/core';
import { IconInfoCircle, IconPlus, IconRefresh } from '@tabler/icons-react';
import cx from 'clsx';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { formatPrice } from '@common/utils';
import { productEditor, productSuggestions } from '@/locale/uz';
import type * as Attributes from '@/modules/attributes/types';
import { Calculations, Constants, Suggestions } from '@modules/products';
import type { CreateFormValues } from '@modules/products/forms';
import type { PriceStats } from '@modules/products/suggestions';

import MoneyInput from './MoneyInput';
import OptionChips from './OptionChips';
import VariantTable from './VariantTable';
import classes from './Form.module.css';

type IProps = {
  axes: Attributes.IEntity.CategoryAttribute[];
  commissionPercent: number;
  priceStats: PriceStats | null;
  priceSource: 'similar' | 'category';
};

const money = (value: number) => `${formatPrice(value)} ${productEditor.currency}`;

const ColumnLabel = ({
  label,
  hint,
  required,
  aside
}: {
  label: string;
  hint?: string;
  required?: boolean;
  aside?: ReactNode;
}) => (
  <div className={classes.labelRow}>
    <Input.Label required={required}>
      {label}
      {hint && <span className={classes.labelHint}>{hint}</span>}
    </Input.Label>
    {aside}
  </div>
);

/** Section 03: variant axes, prices with profit preview, and generated variants. */
const Pricing = ({ axes, commissionPercent, priceStats, priceSource }: IProps) => {
  const {
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, isSubmitted }
  } = useFormContext<CreateFormValues>();

  const { fields, replace, remove } = useFieldArray({ control, name: 'variants', keyName: '_id' });

  const [price = 0, discountEnabled, discountPrice = 0, purchasePrice = 0, variantOptions] = useWatch({
    control,
    name: ['price', 'discountEnabled', 'discountPrice', 'purchasePrice', 'variantOptions']
  });

  const breakdown = Calculations.profit({
    price,
    discountEnabled,
    discountPrice,
    purchasePrice,
    commissionPercent
  });

  const axisNames = axes.map(axis => axis.nameUz);
  const hasChosenOptions = Object.values(variantOptions ?? {}).some(ids => ids?.length);

  const generate = () => {
    const values = getValues();
    const selected = Object.fromEntries(
      Object.entries(values.variantOptions).map(([key, ids]) => [Constants.attributeIdFromKey(key), ids])
    );
    const rows = Calculations.generateVariants(
      axes.map(axis => ({
        attributeDefinitionId: axis.id,
        name: axis.nameUz,
        options: axis.options.map(option => ({ id: option.id, label: option.valueUz }))
      })),
      selected,
      values.variants,
      { name: values.name, stockQuantity: values.stockQuantity }
    );
    replace(rows);
    clearErrors('variants');
  };

  const applyStock = () =>
    fields.forEach((_, index) =>
      setValue(`variants.${index}.stockQuantity`, getValues('stockQuantity'), { shouldDirty: true })
    );

  const apply = (name: 'price' | 'discountPrice', value: number) =>
    setValue(name, value, { shouldDirty: true, shouldValidate: isSubmitted });

  const discountPresets = Suggestions.discountPresets(price);
  const variantsError = errors.variants?.message ?? errors.variants?.root?.message;

  return (
    <Stack gap="xl">
      {axes.length > 0 && (
        <>
          <div className={cx(classes.banner, classes.bannerMuted)}>
            <IconInfoCircle size={18} className={classes.bannerIcon} />
            <span>
              <strong>{productEditor.variantInfoTitle(axisNames.join(' va ').toLocaleLowerCase())}</strong>{' '}
              {productEditor.variantInfo}
            </span>
          </div>

          {axes.map(axis => (
            <Input.Wrapper
              key={axis.id}
              withAsterisk={axis.required}
              label={
                <>
                  {axis.nameUz}
                  <span className={classes.labelHint}>{productEditor.chooseMany}</span>
                </>
              }
            >
              <div className={classes.fieldBody}>
                <Controller
                  control={control}
                  name={`variantOptions.${Constants.specKey(axis.id)}`}
                  render={({ field }) => (
                    <OptionChips
                      multiple
                      swatch={axis.displayType === 'SWATCH'}
                      options={axis.options}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      aria-label={axis.nameUz}
                    />
                  )}
                />
              </div>
            </Input.Wrapper>
          ))}
        </>
      )}

      <div className={classes.prices}>
        {/* purchase price */}
        <Stack gap={6}>
          <ColumnLabel label={productEditor.purchasePrice} hint={productEditor.purchasePriceHint} required />
          <MoneyInput name="purchasePrice" placeholder="90 000" aria-label={productEditor.purchasePrice} />
          <Text size="xs" c="dimmed">
            {productEditor.purchasePriceNote}
          </Text>
        </Stack>

        {/* online price */}
        <Stack gap={6}>
          <ColumnLabel
            label={productEditor.onlinePrice}
            required
            aside={
              <Controller
                control={control}
                name="discountEnabled"
                render={({ field }) => (
                  <Switch
                    size="xs"
                    labelPosition="left"
                    label={productEditor.discount}
                    checked={field.value}
                    onChange={event => field.onChange(event.currentTarget.checked)}
                  />
                )}
              />
            }
          />
          <MoneyInput name="price" placeholder="150 000" aria-label={productEditor.onlinePrice} />

          {priceStats && (
            <div className={classes.hint}>
              <Text size="xs" c="dimmed">
                {priceSource === 'category'
                  ? productSuggestions.priceRangeCategory
                  : productSuggestions.priceRangeSimilar}{' '}
                {formatPrice(priceStats.min)} – {formatPrice(priceStats.max)}, {productSuggestions.median}{' '}
                {formatPrice(priceStats.median)}
              </Text>
              {price !== priceStats.median && (
                <Button size="compact-xs" variant="subtle" onClick={() => apply('price', priceStats.median)}>
                  {productSuggestions.useMedian}
                </Button>
              )}
            </div>
          )}

          {discountEnabled && (
            <>
              <MoneyInput
                name="discountPrice"
                placeholder={productEditor.discountPrice}
                aria-label={productEditor.discountPrice}
              />
              {discountPresets.length > 0 && (
                <div className={classes.hint}>
                  {discountPresets.map(preset => (
                    <Button
                      key={preset.percent}
                      size="compact-xs"
                      variant="default"
                      onClick={() => apply('discountPrice', preset.value)}
                    >
                      −{preset.percent}% · {formatPrice(preset.value)}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}

          <div className={classes.breakdown}>
            <div className={classes.breakdownRow}>
              <span>{productEditor.commissionRow(commissionPercent)}</span>
              <span className={classes.negative}>−{money(breakdown.commission)}</span>
            </div>
            <div className={cx(classes.breakdownRow, classes.breakdownStrong)}>
              <span>{productEditor.payout}</span>
              <span>{money(breakdown.payout)}</span>
            </div>
            <div className={classes.breakdownRow}>
              <span>{productEditor.onlineProfit}</span>
              <span className={breakdown.onlineProfit < 0 ? classes.negative : classes.positive}>
                {money(breakdown.onlineProfit)}
              </span>
            </div>
          </div>
        </Stack>

        {/* stock */}
        <Stack gap={6}>
          <ColumnLabel label={axes.length ? productEditor.defaultStock : productEditor.stock} />
          <MoneyInput
            name="stockQuantity"
            keepZero
            unit={productEditor.pieces}
            placeholder="10"
            aria-label={productEditor.stock}
          />
        </Stack>
      </div>

      {axes.length > 0 && (
        <Stack gap="sm">
          <Button
            leftSection={fields.length ? <IconRefresh size={18} /> : <IconPlus size={18} />}
            onClick={generate}
            disabled={!hasChosenOptions}
            fullWidth
          >
            {fields.length ? productEditor.regenerate : productEditor.generate}
          </Button>
          {variantsError && (
            <Text size="sm" c="red">
              {variantsError}
            </Text>
          )}
          {fields.length > 0 && (
            <>
              <Group justify="space-between">
                <Badge variant="outline" color="gray" radius="sm">
                  {productEditor.variantsCount(fields.length)}
                </Badge>
              </Group>
              <VariantTable fields={fields} basePrice={price} onRemove={remove} onApplyStock={applyStock} />
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default Pricing;
