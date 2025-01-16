import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogIn, 
  Mail,
  Phone, 
  Key, 
  MessageCircle, 
  Github, 
  Facebook, 
  Twitter, 
  ArrowRight, 
  Smartphone,
  AlertCircle,
  UserPlus,
  KeyRound,
  Lock,
  Loader2
} from 'lucide-react';

const AuthComponent = () => {
  // Authentication states
  const [authMode, setAuthMode] = useState('login'); // login, register, forgot-password
  const [authMethod, setAuthMethod] = useState('email');
  const [step, setStep] = useState('initial');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [fullName, setFullName] = useState('');

  // Helper to validate email/phone
  const validateIdentifier = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  // Handle initial identifier submit
  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateIdentifier(identifier)) {
      setError('Please enter a valid email or phone number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/check-identifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      
      if (!response.ok) throw new Error('Failed to verify identifier');
      
      const data = await response.json();
      if (data.hasMFA) {
        setStep('mfa');
      } else if (data.hasPassword) {
        setStep('password');
      } else {
        setStep('otp');
        await sendOTP();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateIdentifier(identifier)) {
      setError('Please enter a valid email or phone number');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier,
          password,
          fullName
        })
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      setStep('verify-email');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset request
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      
      if (!response.ok) throw new Error('Failed to send reset instructions');
      
      setStep('reset-sent');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle magic link
  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      
      if (!response.ok) throw new Error('Failed to send magic link');
      
      setStep('magic-link-sent');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send OTP (Email/SMS/WhatsApp)
  const sendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier,
          method: authMethod
        })
      });
      
      if (!response.ok) throw new Error('Failed to send OTP');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (authMode) {
      case 'register':
        return (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email or Phone Number</Label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Register
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setAuthMode('login')}
            >
              Already have an account? Sign in
            </Button>
          </form>
        );

      case 'forgot-password':
        return (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label>Email or Phone Number</Label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email or phone number"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <KeyRound className="h-4 w-4 mr-2" />
              )}
              Reset Password
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setAuthMode('login')}
            >
              Back to Sign In
            </Button>
          </form>
        );

      default: // login
        return step === 'initial' ? (
          <>
            <form onSubmit={handleIdentifierSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Email or Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email or phone number"
                    required
                  />
                  <Button type="submit" disabled={loading}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>

            <Button
              type="button"
              variant="ghost"
              className="w-full mt-2"
              onClick={handleMagicLink}
              disabled={loading}
            >
              <Key className="h-4 w-4 mr-2" />
              Sign in with Magic Link
            </Button>

            <div className="my-6">
              <Separator />
              <p className="text-center text-sm text-gray-500 my-4">or continue with</p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('google')}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Google
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('facebook')}
                  className="w-full"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleSocialLogin('github')}
                  className="w-full"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleSocialLogin('twitter')}
                  className="w-full"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setAuthMode('register')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setAuthMode('forgot-password')}
              >
                <Lock className="h-4 w-4 mr-2" />
                Forgot Password
              </Button>
            </div>
          </>
        ) : step === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep('otp')}
            >
              Use OTP instead
            </Button>
          </form>
        ) : step === 'otp' ? (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={authMethod === 'email' ? 'default' : 'outline'}
                onClick={() => setAuthMethod('email')}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant={authMethod === 'sms' ? 'default' : 'outline'}
                onClick={() => setAuthMethod('sms')}
                className="flex-1"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                SMS
              </Button>
              <Button
                variant={authMethod === 'whatsapp' ? 'default' : 'outline'}
                onClick={() => setAuthMethod('whatsapp')}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            <form onSubmit={handleOTPVerify} className="space-y-4">
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : 'Verify OTP'}
              </Button>
            </form>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={sendOTP}
              disabled={loading}
            >
              Resend OTP
            </Button>
          </div>
        ) : step === 'magic-link-sent' ? (
          <div className="text-center space-y-4">
            <Mail className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Check your inbox</h3>
            <p className="text-sm text-gray-500">
              We've sent a magic link to your email address. Click the link to sign in.
            </p>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleMagicLink}
              disabled={loading}
            >
              Resend magic link
            </Button>
          </div>
        ) : null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {authMode === 'register' ? (
              <>
                <UserPlus className="h-5 w-5" />
                Create Account
              </>
            ) : authMode === 'forgot-password' ? (
              <>
                <KeyRound className="h-5 w-5" />
                Reset Password
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign In
              </>
            )}
          </CardTitle>
          <CardDescription>
            {authMode === 'register' 
              ? 'Create a new account to get started'
              : authMode === 'forgot-password'
              ? 'Reset your password'
              : 'Choose your preferred way to sign in'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {renderForm()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthComponent;
