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

          <Button type="submit" title="Qidirish" />

          {watch('status') ? (
            <Button
              title="Tozalash"
              variant="default"
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
