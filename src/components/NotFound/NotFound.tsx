import { useNavigate } from 'react-router-dom';

import { Button, Card, Container, Flex, Text, Title } from '@mantine/core';

import classes from './NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container size="xs" className={classes.wrapper}>
      <Flex direction="column" align="center" gap="xl">
        <Card className={classes.card} padding="lg" radius="lg">
          <p className={classes.code}>404</p>
        </Card>

        <div className={classes.content}>
          <Title order={2} className={classes.title}>
            Sahifa topilmadi
          </Title>

          <Text className={classes.description}>
            Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.
          </Text>
        </div>

        <Button size="md" radius="xl" className={classes.button} onClick={() => navigate('/')}>
          Bosh sahifaga
        </Button>
      </Flex>
    </Container>
  );
};

export default NotFound;
