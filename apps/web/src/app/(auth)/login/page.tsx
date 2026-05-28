import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { AuthShell, OAuthButtons, TwoFactorPreview } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Open your workspace with secure sessions, realtime presence, and encrypted device tracking.">
      <form className="grid gap-5">
        <OAuthButtons />
        <div className="relative text-center text-xs text-muted-foreground before:absolute before:left-0 before:top-1/2 before:h-px before:w-[42%] before:bg-border after:absolute after:right-0 after:top-1/2 after:h-px after:w-[42%] after:bg-border">
          or
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" type="email" placeholder="you@company.com" />
          </div>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Password
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" type="password" placeholder="************" />
          </div>
        </label>
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
          <Link href="/signup" className="text-muted-foreground hover:text-foreground">
            Create account
          </Link>
        </div>
        <TwoFactorPreview />
        <Button size="lg" asChild>
          <Link href="/dashboard">
            Continue
            <ArrowRight />
          </Link>
        </Button>
      </form>
    </AuthShell>
  );
}
