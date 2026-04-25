import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ACCESS_TOKEN } from "@/lib/cookies";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const token = (await cookies()).get(COOKIE_ACCESS_TOKEN)?.value;
  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f1eb] px-4 py-16">
      <Suspense
        fallback={
          <div className="h-48 w-full max-w-sm animate-pulse rounded-2xl bg-stone-200/80" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
