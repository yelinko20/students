import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { FormWrapper } from "./form-wrapper";
import { Form } from "./ui/form";
import { authValidators } from "@/schemas/schemas";

export async function AuthForm() {
  const form = useForm<z.infer<typeof authValidators>>({
    resolver: zodResolver(authValidators),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  return (
    <FormWrapper title="Login" description="">
      <Form {...form}>
        <form></form>
      </Form>
    </FormWrapper>
  );
}
