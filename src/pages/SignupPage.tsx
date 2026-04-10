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
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    agreeToTerms?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!firstname.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
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
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                }}
                aria-invalid={!!errors.firstName}
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.firstName}
                </p>
              )}
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
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                }}
                aria-invalid={!!errors.lastName}
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              {errors.lastName && (
                <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.lastName}
                </p>
              )}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={!!errors.email}
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.email}
                </p>
              )}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                aria-invalid={!!errors.password}
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => {
                    setAgreeToTerms(checked === true);
                    if (errors.agreeToTerms) setErrors((prev) => ({ ...prev, agreeToTerms: undefined }));
                  }}
                  className={`mt-1 border-border ${errors.agreeToTerms ? "border-destructive ring-destructive/20" : ""}`}
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
              {errors.agreeToTerms && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.agreeToTerms}
                </p>
              )}
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
