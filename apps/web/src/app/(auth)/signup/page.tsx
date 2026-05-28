import Link from "next/link";
import { ArrowRight, Building2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { AuthShell, OAuthButtons } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <AuthShell title="Create your command center" subtitle="Start with a workspace, invite teammates, and let FlowForge shape the first sprint.">
      <form className="grid gap-5">
        <OAuthButtons />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Name
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Avery Stone" />
            </div>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Workspace
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Orbit Labs" />
            </div>
          </label>
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
            <Input className="pl-9" type="password" placeholder="Minimum 12 characters" />
          </div>
        </label>
        <Button size="lg" asChild>
          <Link href="/verify-email">
            Create workspace
            <ArrowRight />
          </Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
