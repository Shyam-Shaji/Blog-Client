import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { register } from "@/auth/authSlice";
import { toast } from "sonner";


export function SignupPage() {
  const dispatch = useAppDispatch();
  const [firstname, setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!agreeToTerms){
      alert('Please agree to the terms and conditions');
    }
    setIsLoading(true);
    try {
      await dispatch(register({
        username: `${firstname} ${lastName}`,
        firstName: firstname,
        lastName: lastName,
        email,
        password,
      })
    ).unwrap();
      toast.success("Account created successfully"); 
    } catch (error:any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-8">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Join Our Community
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Create your blog account today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}  className="space-y-5">
            {/*First Name Input */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground font-semibold">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John Doe"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/*Last Name Input */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground font-semibold">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="John Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-foreground font-semibold"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                className="mt-1 border-border"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground font-normal leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <Link to="#" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-6"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link to="/">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border text-foreground hover:bg-secondary"
            >
              Sign In
            </Button>
          </Link>

          {/* Footer */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Your information is secure and will never be shared with third
            parties.
          </p>
        </div>
      </Card>
    </div>
  );
}
