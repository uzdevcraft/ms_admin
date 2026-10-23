import {
  Accordion,
  ActionIcon,
  Alert,
  Autocomplete,
  Badge,
  Button,
  Card,
  Combobox,
  createTheme,
  Input,
  InputWrapper,
  Menu,
  Modal,
  MultiSelect,
  Paper,
  Popover,
  Select,
  Table,
  Title,
  Tooltip,
  type MantineColorsTuple
} from '@mantine/core';

import classes from '@/styles/theme.module.scss';

export const COLOR_SCHEME_STORAGE_KEY = 'ms-admin-color-scheme';

/**
 * Brand palette — a calm cobalt-indigo. It replaces Mantine's `blue`, so every
 * existing `color="blue"`, `--blue-N` and the primary colour share one accent.
 */
const brand: MantineColorsTuple = [
  '#eef1ff',
  '#dde3ff',
  '#b9c4ff',
  '#93a3fd',
  '#7182f9',
  '#5a68f3',
  '#4a55e6',
  '#3c44c9',
  '#333aa3',
  '#2c3381'
];

/** Cool, deep neutrals for dark mode (surfaces 7–9, borders 4–5, text 0–2). */
const dark: MantineColorsTuple = [
  '#d5d8e0',
  '#aeb3c0',
  '#8a90a0',
  '#666c7d',
  '#3a3f4d',
  '#2c303b',
  '#22252e',
  '#1a1c24',
  '#14161c',
  '#0f1015'
];

const FONT_FAMILY = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';

const comboboxProps = { shadow: 'md', radius: 'md', offset: 6, transitionProps: { duration: 120 } } as const;
const comboboxClassNames = { dropdown: classes.dropdown, option: classes.option };

export const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 6 },
  colors: { blue: brand, dark },
  activeClassName: classes.active,
  fontFamily: FONT_FAMILY,
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  defaultRadius: 'md',
  cursorType: 'pointer',
  radius: { xs: '4px', sm: '6px', md: '8px', lg: '12px', xl: '16px' },
  fontSizes: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem', lg: '1.0625rem', xl: '1.25rem' },
  lineHeights: { xs: '1.45', sm: '1.5', md: '1.55', lg: '1.55', xl: '1.6' },
  shadows: {
    xs: '0 1px 2px rgba(16, 24, 40, 0.05)',
    sm: '0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)',
    md: '0 6px 16px -4px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
    lg: '0 16px 32px -8px rgba(16, 24, 40, 0.14), 0 4px 8px -4px rgba(16, 24, 40, 0.06)',
    xl: '0 24px 48px -12px rgba(16, 24, 40, 0.20)'
  },
  headings: {
    fontFamily: FONT_FAMILY,
    fontWeight: '650',
    sizes: {
      h1: { fontSize: '1.75rem', lineHeight: '1.25' },
      h2: { fontSize: '1.375rem', lineHeight: '1.3' },
      h3: { fontSize: '1.125rem', lineHeight: '1.35' },
      h4: { fontSize: '1rem', lineHeight: '1.4' },
      h5: { fontSize: '0.9375rem', lineHeight: '1.4' },
      h6: { fontSize: '0.875rem', lineHeight: '1.4' }
    }
  },
  components: {
    Paper: Paper.extend({
      defaultProps: { shadow: 'xs', radius: 'lg' },
      classNames: { root: classes.paper }
    }),
    Card: Card.extend({
      defaultProps: { radius: 'lg' },
      classNames: { root: classes.card }
    }),
    Button: Button.extend({
      defaultProps: { radius: 'md' },
      classNames: { root: classes.button, section: classes.buttonSection },
      // Tighter horizontal padding than Mantine's default: reads as a control, not a banner.
      vars: (_theme, props) => {
        const paddingX: Partial<Record<string, string>> = { xs: '10px', sm: '14px', md: '18px', lg: '22px' };
        const size = typeof props.size === 'string' ? props.size : 'sm';
        return paddingX[size] ? { root: { '--button-padding-x': paddingX[size] } } : { root: {} };
      }
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: { radius: 'md' },
      classNames: { root: classes.actionIcon }
    }),
    Input: Input.extend({
      classNames: { input: classes.input }
    }),
    InputWrapper: InputWrapper.extend({
      classNames: { label: classes.inputLabel, description: classes.inputDescription, error: classes.inputError }
    }),
    Select: Select.extend({ defaultProps: { comboboxProps }, classNames: comboboxClassNames }),
    MultiSelect: MultiSelect.extend({ defaultProps: { comboboxProps }, classNames: comboboxClassNames }),
    Autocomplete: Autocomplete.extend({ defaultProps: { comboboxProps }, classNames: comboboxClassNames }),
    Combobox: Combobox.extend({ defaultProps: { shadow: 'md', radius: 'md' } }),
    Popover: Popover.extend({
      defaultProps: { shadow: 'md', radius: 'md' },
      classNames: { dropdown: classes.dropdown }
    }),
    Menu: Menu.extend({ defaultProps: { shadow: 'md', radius: 'md' }, classNames: { dropdown: classes.dropdown } }),
    Tooltip: Tooltip.extend({
      defaultProps: { radius: 'sm', withArrow: true, openDelay: 150 },
      classNames: { tooltip: classes.tooltip }
    }),
    Badge: Badge.extend({
      defaultProps: { radius: 'sm' },
      classNames: { root: classes.badge }
    }),
    Modal: Modal.extend({
      defaultProps: {
        radius: 'lg',
        overlayProps: { backgroundOpacity: 0.45, blur: 3 },
        transitionProps: { transition: 'pop', duration: 160 }
      },
      classNames: { content: classes.modalContent, header: classes.modalHeader, title: classes.modalTitle }
    }),
    Alert: Alert.extend({
      defaultProps: { radius: 'md' },
      classNames: { title: classes.alertTitle }
    }),
    Table: Table.extend({
      defaultProps: {
        highlightOnHover: true,
        withRowBorders: true
      },
      classNames: { th: classes.tableTh }
    }),
    Title: Title.extend({
      classNames: { root: classes.title }
    }),
    Accordion: Accordion.extend({
      defaultProps: { radius: 'md' },
      classNames: { item: classes.accordionItem, control: classes.accordionControl }
    })
  }
});
