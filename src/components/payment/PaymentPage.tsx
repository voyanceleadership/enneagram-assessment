import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

type PaymentPageProps = {
  userEmail: string;
  onContinue: () => void;
  onBack: () => void;
};

const PaymentPage = ({ userEmail, onContinue, onBack }: PaymentPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCouponValid, setIsCouponValid] = useState(false);

  useEffect(() => {
    const validateEmail = async () => {
      try {
        const response = await fetch('/api/validate-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        });
        const data = await response.json();
        setIsEmailValid(data.valid);
        
        // If email is valid, automatically continue to results
        if (data.valid) {
          onContinue();
        }
      } catch (err) {
        console.error('Error validating email:', err);
        setIsEmailValid(false);
      }
    };

    if (userEmail) {
      validateEmail();
    }
  }, [userEmail, onContinue]);

  const handleCouponValidation = async () => {
    setIsValidatingCoupon(true);
    setError(null);

    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await response.json();

      if (data.valid) {
        setIsCouponValid(true);
        onContinue();
      } else {
        setError('Invalid coupon code');
        setIsCouponValid(false);
      }
    } catch (err) {
      setError('Error validating coupon');
      setIsCouponValid(false);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError('Error processing payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Access Your Enneagram Results</CardTitle>
        <CardDescription>
          Thank you for taking the assessment! Please provide payment information to access your results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="coupon">Have a coupon code?</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="coupon"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={isValidatingCoupon || isLoading}
              />
              <Button 
                onClick={handleCouponValidation}
                disabled={!couponCode || isValidatingCoupon || isLoading}
              >
                {isValidatingCoupon ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">- or -</p>
            <Button
              onClick={handlePayment}
              disabled={isLoading || isValidatingCoupon}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Pay $29.99 to Access Results
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading || isValidatingCoupon}
          className="w-full"
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentPage;