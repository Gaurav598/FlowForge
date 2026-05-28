import Link from "next/link";
import { ArrowRight, MailCheck } from "lucide-react";
import { AuthShell, TwoFactorPreview } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Verify your email" subtitle="Enter the code from your inbox to finish securing this workspace.">
      <div className="grid gap-5">
        <div className="grid place-items-center rounded-lg border border-border bg-primary/8 p-8">
          <MailCheck className="size-12 text-primary" />
        </div>
        <TwoFactorPreview />
        <Button size="lg" asChild>
          <Link href="/onboarding">
            Verify and continue
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </AuthShell>
  );
}
