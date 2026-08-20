import { Container, Group, Stack, Text, Title } from "@mantine/core";

import classes from "./PageHeader.module.css";

type IProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const PageHeader: React.FC<IProps> = ({
  title,
  description,
  actions,
  children,
}) => {
  return (
    <Container fluid className={classes.pageHeader}>
      <Group className={classes.content}>
        <Stack className={classes.titleContent}>
          <Title className={classes.title} order={1}>
            {title}
          </Title>
          {description && (
            <Text className={classes.description}>{description}</Text>
          )}
        </Stack>

        <Group className={classes.actions}>
          {actions && <div>{actions}</div>}
        </Group>
      </Group>

      {children}
    </Container>
  );
};

export default PageHeader;
