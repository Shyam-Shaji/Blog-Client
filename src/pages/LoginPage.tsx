import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react"
import { useAppDispatch } from "@/app/hooks";
import { login } from "@/auth/authSlice";
import { toast } from "sonner";

export function LoginPage(){
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await dispatch(login({email,password}));
        toast.success("Login successful");
        navigate('/home');
      } catch (error: any) {
        toast.error(error.message || "Login Failed");
      } finally{
        setIsLoading(false);
      }
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Sign in to your blog account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}  className="space-y-6">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-semibold">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-8"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link to="/signup">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border text-foreground hover:bg-secondary"
            >
              Create Account
            </Button>
          </Link>

          {/* Footer */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            By signing in, you agree to our{' '}
            <Link to="#" className="text-accent hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </Card>
    </div>
    )
}