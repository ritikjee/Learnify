"use client";

import { onSignIn } from "@/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SignInSchema } from "./schema";

export const useAuthSignIn = () => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const onAuth = async (payload: { email: string; password: string }) => {
    const { error } = await onSignIn(payload);

    if (!error) {
      reset();
      toast("Success", {
        description: "Welcome back!",
      });
      router.push("/callback/sign-in");
    } else {
      toast("Error", {
        description: error?.message || "email/password is incorrect try again",
      });
    }
  };

  const { mutate: InitiateLoginFlow, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      onAuth({ email, password }),
  });

  const onAuthenticateUser = handleSubmit(async (values) => {
    InitiateLoginFlow({ email: values.email, password: values.password });
  });

  return {
    onAuthenticateUser,
    isPending,
    register,
    errors,
  };
};
