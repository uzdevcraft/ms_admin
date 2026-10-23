import { common } from "@/locale/uz";
import { Alert, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import classes from "./ErrorAlert.module.css";

type IProps = {
  isFetching: boolean;
  refetch: () => void;
};

const ErrorAlert = ({ isFetching, refetch }: IProps) => {
  return (
    <Alert
      color="red"
      variant="light"
      icon={<IconAlertCircle size={20} />}
      withCloseButton={false}
      className={classes.error}
      title={common.somethingWentWrong}
    >
      <Button
        size="xs"
        mt={4}
        color="red"
        variant="light"
        loading={isFetching}
        onClick={() => refetch()}
      >
        Qayta urinish
      </Button>
    </Alert>
  );
};

export default ErrorAlert;
