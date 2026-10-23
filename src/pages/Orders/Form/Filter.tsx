import { IconFilter, IconX } from '@tabler/icons-react';

import { Button } from '@/components/Button';

import { FilterForm, filterDefaultValues, type FilterFormValues } from '@/modules/orders/forms';
import { Form } from '@/pages/Orders/components/filter';

import classes from './Form.module.css';

type IProps = {
  values: FilterFormValues;
  onFilter: (values: FilterFormValues) => void;
};

const Filter = ({ values, onFilter }: IProps) => {
  return (
    <FilterForm className={classes.filter} values={values} onFilter={onFilter}>
      {({ watch, reset }) => (
        <>
          <Form />

          <Button type="submit" title="Qidirish" leftSection={<IconFilter size={16} stroke={1.75} />} />

          {watch('status') ? (
            <Button
              title="Tozalash"
              variant="subtle"
              color="gray"
              leftSection={<IconX size={16} stroke={1.75} />}
              onClick={() => {
                reset(filterDefaultValues);
                onFilter(filterDefaultValues);
              }}
            />
          ) : null}
        </>
      )}
    </FilterForm>
  );
};

export default Filter;
