import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, 
         AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import PaymentHandler from '@/components/payment/PaymentHandler';

const ASSESSMENT_PRICE = 29.99;

type PaymentPageProps = {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  assessmentId: string;  // Add this prop
  onContinue: () => void;
  onBack: () => void;
};

const PaymentPage = ({ userInfo, assessmentId, onContinue, onBack }: PaymentPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const validateEmail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/assessment/payment-flow/validate-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userInfo.email }),
        });

        if (!response.ok) {
          throw new Error('Failed to validate email');
        }

        const data = await response.json();
        setIsEmailValid(data.valid);

        if (data.valid) {
          setShowSuccessDialog(true);
          setDialogMessage('Your email has been validated. You can proceed to results.');
          setTimeout(() => {
            onContinue();
          }, 2000);
        }
      } catch (err) {
        console.error('Error validating email:', err);
        setIsEmailValid(false);
        setDialogMessage('Failed to validate email. Please try again.');
        setShowErrorDialog(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo.email) {
      validateEmail();
    }
  }, [userInfo.email, onContinue]);

  const handleCouponValidation = async () => {
    setIsValidatingCoupon(true);
    setError(null);

    try {
      const response = await fetch('/api/assessment/payment-flow/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          coupon: couponCode,
          assessmentId  // Add assessmentId to coupon validation
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setIsCouponValid(true);
        setDiscountAmount(data.details.discount);
        setDialogMessage(`Coupon applied successfully! ${data.details.discount}% discount`);
        setShowSuccessDialog(true);

        if (data.details.discount === 100) {
          setTimeout(() => {
            onContinue();
          }, 2000);
        }
      } else {
        setDialogMessage(data.error || 'Invalid coupon code');
        setShowErrorDialog(true);
        setIsCouponValid(false);
      }
    } catch (err) {
      setDialogMessage('Error validating coupon. Please try again.');
      setShowErrorDialog(true);
      setIsCouponValid(false);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const finalPrice = discountAmount ? ASSESSMENT_PRICE * (1 - discountAmount / 100) : ASSESSMENT_PRICE;

  return (
    <>
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
              <PaymentHandler 
                email={userInfo.email}
                couponCode={isCouponValid ? couponCode : undefined}
                assessmentId={assessmentId}
              />
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

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaymentPage;