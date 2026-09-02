import { Container, Group, Stack, Text, Title } from '@mantine/core';
import { useLocation } from 'react-router-dom';

import type { BreadcrumbItem } from '@/components/Breadcrumbs';
import { Breadcrumbs, getBreadcrumbs } from '@/components/Breadcrumbs';

import classes from './PageHeader.module.css';

type IProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  // Derived from the current route by default — pass this only to override it.
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
};

const PageHeader: React.FC<IProps> = ({ title, description, actions, breadcrumbs, children }) => {
  const location = useLocation();

  const items = breadcrumbs ?? getBreadcrumbs(location.pathname, title);

  return (
    <Container fluid className={classes.pageHeader}>
      <div className={classes.breadcrumbs}>
        <Breadcrumbs items={items} />
      </div>

      <Group className={classes.content}>
        <Stack className={classes.titleContent}>
          <Title className={classes.title} order={1}>
            {title}
          </Title>
          {description && <Text className={classes.description}>{description}</Text>}
        </Stack>

        <Group className={classes.actions}>{actions && <div>{actions}</div>}</Group>
      </Group>

      {children}
    </Container>
  );
};

export default PageHeader;
