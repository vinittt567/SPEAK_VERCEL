import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserCheck, ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function AnonymousLogin() {
  const [anonymousId, setAnonymousId] = useState('');
  const [showId, setShowId] = useState(false);
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
          title: "Welcome Back",
          description: "You've been successfully authenticated with your anonymous ID.",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center text-primary text-2xl">🌿</div>
            </div>
            <CardTitle className="text-2xl text-center">Anonymous Access</CardTitle>
            <CardDescription className="text-center">
              Enter your anonymous ID to continue your counseling journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="anonymousId">Anonymous ID</Label>
                <div className="relative">
                  <Input
                    id="anonymousId"
                    type={showId ? 'text' : 'password'}
                    placeholder="anon_abcd1234..."
                    value={anonymousId}
                    onChange={(e) => setAnonymousId(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowId(!showId)}
                    disabled={isSubmitting}
                  >
                    {showId ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your anonymous ID was provided after your initial login
                </p>
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
                    Verifying...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Continue Anonymously
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-center">
                <Button variant="link" asChild>
                  <a href="/login" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Institutional Login
                  </a>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-purple-50 p-3 rounded-lg">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Your anonymous ID ensures complete privacy and confidentiality.</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-sm">🔐 How Anonymous Login Works</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use the anonymous ID generated during your first login</li>
                <li>• No personal information is linked to this ID</li>
                <li>• Access all platform features while staying anonymous</li>
                <li>• Your counseling sessions remain completely private</li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <p className="text-xs text-amber-800">
                <strong>Lost your Anonymous ID?</strong><br />
                Unfortunately, anonymous IDs cannot be recovered for privacy reasons. 
                You'll need to create a new account with your institutional email.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}