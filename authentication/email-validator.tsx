import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const validateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/email/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) throw new Error('Validation failed');
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDomain = (domain) => {
    return domain.replace(/^[@.]/, '');
  };

  const getSuggestion = (suggestion) => {
    if (!suggestion) return null;
    const parts = suggestion.split('@');
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEmail(suggestion)}
        className="mt-2"
      >
        Use: {parts[0]}@<strong>{parts[1]}</strong>
      </Button>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-4 mt-4">
        {/* Overall Status */}
        <div className="flex items-center gap-2">
          {results.is_valid ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className={results.is_valid ? 'text-green-600' : 'text-red-600'}>
            {results.is_valid ? 'Valid email address' : 'Invalid email address'}
          </span>
        </div>

        {/* Detailed Results */}
        <div className="grid gap-3 text-sm">
          {/* Format Check */}
          <div className="flex items-center gap-2">
            {results.format_valid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Format validation</span>
          </div>

          {/* Domain Check */}
          <div className="flex items-center gap-2">
            {results.domain_valid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Domain validation ({formatDomain(results.domain)})</span>
          </div>

          {/* SMTP Check */}
          <div className="flex items-center gap-2">
            {results.smtp_valid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>SMTP validation</span>
          </div>

          {/* Disposable Check */}
          <div className="flex items-center gap-2">
            {!results.is_disposable ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            <span>
              {results.is_disposable ? 'Disposable email detected' : 'Not a disposable email'}
            </span>
          </div>

          {/* Bounce Risk */}
          <div className="flex items-center gap-2">
            {results.bounce_risk === 'low' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : results.bounce_risk === 'medium' ? (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Bounce risk: {results.bounce_risk}</span>
          </div>

          {/* Spelling Suggestion */}
          {results.suggested_correction && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Did you mean?</span>
              </div>
              {getSuggestion(results.suggested_correction)}
            </div>
          )}
        </div>
      </div>
    );
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
            <Mail className="h-5 w-5" />
            Email Validator
          </CardTitle>
          <CardDescription>
            Validate email format, domain, and check for disposable accounts
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={validateEmail} className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="flex gap-2">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  type="email"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Validate'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {renderResults()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailValidator;
