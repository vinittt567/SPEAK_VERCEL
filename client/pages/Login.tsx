import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function Login() {
  const [anonymousId, setAnonymousId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { anonymousLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await anonymousLogin(anonymousId);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to SPEAK!",
        });
        navigate('/chat');
      } else {
        setError('Invalid anonymous ID. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center text-primary text-2xl">🌿</div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Login to SPEAK using your anonymous ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="anonymousId">Anonymous ID</Label>
                <Input
                  id="anonymousId"
                  type="text"
                  placeholder="anon_1234567890abcdef..."
                  value={anonymousId}
                  onChange={(e) => setAnonymousId(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="font-mono text-sm"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login Securely
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-center">
                <Button variant="link" asChild>
                  <a href="/register">Don't have an Anonymous ID? Register here</a>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Your anonymous ID protects your identity while accessing counseling services.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}