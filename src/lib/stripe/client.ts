import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!publishableKey) {
      throw new Error('Missing Stripe publishable key');
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export const createPaymentIntent = async (amount: number, metadata: Record<string, string>) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'xof', // West African CFA franc
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
};

export const confirmPayment = async (
  clientSecret: string,
  paymentMethod: { card: any; billing_details: any }
) => {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Stripe not initialized');

  return stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod,
  });
};
