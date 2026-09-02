import { createTheme } from '@mantine/core';

import classes from '@/styles/theme.module.scss';

export const COLOR_SCHEME_STORAGE_KEY = 'ms-admin-color-scheme';

export const theme = createTheme({
  primaryColor: 'blue',
  activeClassName: classes.active,
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headings: { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' },
  defaultRadius: 'md',
  components: {
    Paper: {
      defaultProps: {
        shadow: 'xs'
      }
    },
    Table: {
      defaultProps: {
        striped: 'odd',
        highlightOnHover: true,
        withRowBorders: true
      }
    }
  }
});
