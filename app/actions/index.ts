"use server";
import { signIn, signOut } from "@/auth";
export const login = async () => {
  console.log("Logging in...");
  await signIn("google", { redirectTo: "/test" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/", redirect: true });
};
