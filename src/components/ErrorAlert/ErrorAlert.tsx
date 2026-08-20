import { common } from "@/locale/uz";
import { Alert, Button } from "@mantine/core";

import classes from "./ErrorAlert.module.css";

type IProps = {
  isFetching: boolean;
  refetch: () => void;
};

const ErrorAlert = ({ isFetching, refetch }: IProps) => {
  return (
    <Alert
      color="red"
      withCloseButton={false}
      className={classes.error}
      title={common.somethingWentWrong}
    >
      <Button
        size="xs"
        variant="white"
        loading={isFetching}
        onClick={() => refetch()}
      >
        Qayta urinish
      </Button>
    </Alert>
  );
};

export default ErrorAlert;
