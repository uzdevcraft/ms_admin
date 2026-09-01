import * as yup from "yup";

import type * as Types from "../types";

export const loginFormSchema: yup.ObjectSchema<Types.IForm.Login> = yup.object({
  username: yup.string().required("Majburiy maydon"),
  password: yup.string().required("Majburiy maydon"),
});

export type LoginFormValues = Types.IForm.Login;

export const defaultValues: LoginFormValues = {
  username: "",
  password: "",
};
