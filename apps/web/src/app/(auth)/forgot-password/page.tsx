import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset access" subtitle="FlowForge will send a short-lived recovery link and record the device event.">
      <form className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium">
          Email
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" type="email" placeholder="you@company.com" />
          </div>
        </label>
        <Button size="lg" asChild>
          <Link href="/login">
            Send reset link
            <ArrowRight />
          </Link>
        </Button>
      </form>
    </AuthShell>
  );
}
