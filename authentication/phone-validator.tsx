import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Globe,
  Building2
} from 'lucide-react';

const PhoneValidator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dial_code.includes(searchTerm)
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchTerm, countries]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/phone/countries');
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      setCountries(data);
      setFilteredCountries(data);
    } catch (err) {
      setError('Failed to load country list');
    }
  };

  const validatePhone = async (e) => {
    e.preventDefault();
    if (!selectedCountry || !phoneNumber) {
      setError('Please select a country and enter a phone number');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/phone/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: selectedCountry.dial_code,
          phone_number: phoneNumber
        })
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

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryList(false);
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
            {results.is_valid ? 'Valid phone number' : 'Invalid phone number'}
          </span>
        </div>

        {/* Detailed Results */}
        <div className="grid gap-3 text-sm">
          {/* Format Check */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Country: {results.country_name}</span>
          </div>

          {/* Provider Info */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Provider: {results.carrier || 'Unknown'}</span>
          </div>

          {/* Additional Details */}
          {results.details && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-2">Additional Details:</h4>
              <ul className="space-y-1">
                <li>Type: {results.details.line_type || 'Unknown'}</li>
                <li>Region: {results.details.region || 'Unknown'}</li>
                {results.details.formatted_number && (
                  <li>Formatted: {results.details.formatted_number}</li>
                )}
              </ul>
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
            <Phone className="h-5 w-5" />
            Phone Number Validator
          </CardTitle>
          <CardDescription>
            Validate phone numbers and get carrier information
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={validatePhone} className="space-y-4">
            {/* Country Selection */}
            <div className="space-y-2">
              <Label>Country</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowCountryList(!showCountryList)}
                >
                  {selectedCountry ? (
                    <>
                      <span className="mr-2">{selectedCountry.flag}</span>
                      {selectedCountry.name} ({selectedCountry.dial_code})
                    </>
                  ) : (
                    'Select a country'
                  )}
                </Button>

                {showCountryList && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    <div className="p-2">
                      <Input
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <div className="max-h-60 overflow-auto">
                      {filteredCountries.map((country) => (
                        <Button
                          key={country.code}
                          type="button"
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => selectCountry(country)}
                        >
                          <span className="mr-2">{country.flag}</span>
                          {country.name} ({country.dial_code})
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex gap-2">
                {selectedCountry && (
                  <div className="flex items-center bg-gray-100 px-3 rounded-md">
                    {selectedCountry.dial_code}
                  </div>
                )}
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="flex-1"
                  type="tel"
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

export default PhoneValidator;
