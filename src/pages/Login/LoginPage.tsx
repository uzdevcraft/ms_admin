import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { loginSchema, type LoginFormValues } from "../../schemas";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  if (session) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    try {
      await login(values.username, values.password);
      navigate("/");
    } catch {
      setError(
        "Invalid username or password. Only admin accounts can sign in.",
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoTitle}>Magic Store</div>
          <div className={styles.logoSubtitle}>Admin Panel</div>
        </div>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            mb="md"
            size="md"
            label="Username"
            placeholder="Your username"
            error={errors.username?.message}
            {...register("username")}
          />
          <PasswordInput
            mb="lg"
            size="md"
            label="Password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" size="md" fullWidth loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
