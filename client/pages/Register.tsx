import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, UserPlus, Shield, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAnonymousId, setShowAnonymousId] = useState(false);
  const [anonymousId, setAnonymousId] = useState('');
  const [copied, setCopied] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const supportedInstitutions = [
    'ju.ac.in - University of Jammu',
    'cukashmir.ac.in - Central University of Kashmir',
    'nitsri.ac.in - NIT Srinagar',
    'iiim.ac.in - IIIM Jammu',
    'skuastkashmir.ac.in - SKUAST Kashmir',
    'iust.ac.in - Islamic University of Science & Technology',
    'bgsbu.ac.in - Baba Ghulam Shah Badshah University',
    'cusrinagar.ac.in - Cluster University Srinagar',
    'cujammu.ac.in - Cluster University Jammu',
    'kashmiruniversity.ac.in - Kashmir University College'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await register(email, password, name, course, parseInt(year) || 1);
      if (result.success) {
        setAnonymousId(result.user.anonymousId);
        setShowAnonymousId(true);
        toast({
          title: "Registration Successful!",
          description: "Your anonymous ID has been generated. Please save it for future logins.",
        });
      } else {
        setError('Registration failed. Please check your credentials.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      
      // Handle specific error codes
      if (errorMessage.includes('Institution not recognized')) {
        setError('Please use your institutional email address from a supported institution.');
      } else if (errorMessage.includes('already exists')) {
        setError('An account with this email already exists. Please login instead.');
      } else if (errorMessage.includes('Password must be at least')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(anonymousId);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Anonymous ID copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    setShowAnonymousId(false);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-4xl flex gap-8">
        {/* Registration Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center text-primary text-2xl">🌿</div>
            </div>
            <CardTitle className="text-2xl text-center">Join SPEAK</CardTitle>
            <CardDescription className="text-center">
              Register with your institutional email to get your anonymous ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Institutional Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@ju.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="course">Course (Optional)</Label>
                  <Input
                    id="course"
                    type="text"
                    placeholder="Computer Science"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year (Optional)</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="1"
                    min="1"
                    max="6"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
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
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register & Get Anonymous ID
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-center">
                <Button variant="link" asChild>
                  <a href="/login">Already have an Anonymous ID? Login here</a>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Your identity is protected. Original credentials are deleted after generating your anonymous ID.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Institutions */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">Supported Institutions</CardTitle>
            <CardDescription>
              Jammu & Kashmir Educational Institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {supportedInstitutions.map((institution, index) => (
                <div key={index} className="text-sm p-2 bg-muted/50 rounded border-l-2 border-green-500">
                  {institution}
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-sm">🔒 Privacy Protection</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Your email & password are deleted after verification</li>
                <li>• Only anonymous ID is used for platform access</li>
                <li>• No personal information is stored permanently</li>
                <li>• Complete privacy and confidentiality guaranteed</li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-800">
                <strong>Demo Account:</strong><br />
                Email: test.student@ju.ac.in<br />
                Password: password123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anonymous ID Popup */}
      <Dialog open={showAnonymousId} onOpenChange={setShowAnonymousId}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Registration Successful!
            </DialogTitle>
            <DialogDescription>
              Your anonymous ID has been generated. Please save this ID - you'll need it to login in the future.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Your Anonymous ID:</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={anonymousId}
                  readOnly
                  className="text-sm font-mono"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Your original email and password have been permanently deleted. 
                Use this anonymous ID for all future logins.
              </AlertDescription>
            </Alert>

            <Button onClick={handleContinue} className="w-full">
              Continue to SPEAK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}