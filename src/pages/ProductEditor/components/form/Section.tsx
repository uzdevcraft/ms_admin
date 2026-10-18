import type { ReactNode } from 'react';

import classes from './Form.module.css';

type IProps = {
  number: number;
  title: string;
  /** Right side of the header (e.g. the commission badge). */
  aside?: ReactNode;
  children: ReactNode;
};

const Section = ({ number, title, aside, children }: IProps) => (
  <section className={classes.section}>
    <header className={classes.sectionHeader}>
      <h2 className={classes.sectionTitle}>
        <span className={classes.sectionNumber}>{number}</span>
        {title}
      </h2>
      {aside}
    </header>
    {children}
  </section>
);

export default Section;
