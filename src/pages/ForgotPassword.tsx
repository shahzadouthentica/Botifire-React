import { Link } from "react-router-dom";
import { Bot, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/images/botifire_logo.png" alt="Botifire" className="h-10 object-contain" />
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Don't worry,<br />we've got you covered.
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-md">
            Enter your email address and we'll send you a link to reset your password and get back to building.
          </p>
        </div>

        <p className="relative z-10 text-primary-foreground/40 text-sm">
          © 2026 Botifire. All rights reserved.
        </p>

        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border border-primary-foreground/10" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border border-primary-foreground/10" />
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full border border-primary-foreground/5" />
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <img src="/images/botifire_logo.png" alt="Botifire" className="h-9 object-contain" />
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-5">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Reset your password</h2>
            <p className="text-muted-foreground font-medium mt-1.5">
              Enter the email associated with your account and we'll send a reset link.
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 bg-secondary/50 border-border"
              />
            </div>

            <Button className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-medium">
              Send reset link
            </Button>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
