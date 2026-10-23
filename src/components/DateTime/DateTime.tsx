import dayjs from 'dayjs';

import { common } from '@/locale/uz';

import classes from './DateTime.module.scss';

type IProps = {
  value?: string | null;
};

/** Two-line date/time for tables: the date carries the weight, the time is secondary. */
const DateTime = ({ value }: IProps) => {
  const date = value ? dayjs(value) : null;

  if (!date || !date.isValid()) return <span className={classes.empty}>{common.dash}</span>;

  return (
    <time dateTime={date.toISOString()} className={classes.root}>
      <span className={classes.date}>{date.format('DD/MM/YYYY')}</span>
      <span className={classes.time}>{date.format('HH:mm')}</span>
    </time>
  );
};

export default DateTime;
