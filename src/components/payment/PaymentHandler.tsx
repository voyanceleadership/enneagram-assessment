import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

declare global {
  interface Window {
    Stripe?: (key: string) => any;
  }
}

interface PaymentHandlerProps {
  email: string;
  couponCode?: string;
  assessmentId: string;  // Add this prop
}

// Get publishable key once when component is defined
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
  console.error('Stripe publishable key is not defined in environment variables');
}

const PaymentHandler: React.FC<PaymentHandlerProps> = ({ email, couponCode, assessmentId }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    if (!window.Stripe) {
      console.error('Stripe.js not loaded');
      return;
    }
    
    if (!stripePublishableKey) {
      console.error('Missing Stripe publishable key');
      return;
    }

    try {
      const stripeInstance = window.Stripe(stripePublishableKey);
      console.log('Stripe initialized successfully');
      setStripe(stripeInstance);
    } catch (err) {
      console.error('Error initializing Stripe:', err);
      setError('Failed to initialize payment system');
    }
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }

      // Create checkout session
      const response = await fetch('/api/assessment/payment-flow/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          couponCode,
          assessmentId,  // Add the assessmentId to the request
        }),
      });

      console.log('Checkout API Response:', {
        status: response.status,
        statusText: response.statusText,
      });

      const data = await response.json();
      console.log('Checkout API Data:', data);

      if (data.error) {
        setError(data.error);
        return;
      }

      // If we get a direct URL to results (for valid emails or 100% discount coupons)
      if (data.url === '/assessment/results') {
        window.location.href = data.url;
        return;
      }

      // For Stripe checkout, redirect to the provided URL
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error('No valid URL received from checkout endpoint');

    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
      <p className="text-sm text-gray-600 text-center">
        You will be redirected to a secure payment page
      </p>
    </div>
  );
};

export default PaymentHandler;