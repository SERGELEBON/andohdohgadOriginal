/**
 * Orange Money Payment Integration
 * Documentation: https://developer.orange.com/apis/orange-money-webpay/
 */

export interface OrangeMoneyPaymentRequest {
  amount: number;
  currency: string;
  order_id: string;
  return_url: string;
  cancel_url: string;
  notif_url: string;
  lang: string;
  reference: string;
}

export interface OrangeMoneyPaymentResponse {
  payment_url: string;
  payment_token: string;
  notif_token: string;
}

const ORANGE_MONEY_API_URL = import.meta.env.ORANGE_MONEY_API_URL || '';
// const ORANGE_MONEY_MERCHANT_KEY = import.meta.env.ORANGE_MONEY_MERCHANT_KEY || '';
const ORANGE_MONEY_API_KEY = import.meta.env.ORANGE_MONEY_API_KEY || '';

export const initiateOrangeMoneyPayment = async (
  amount: number,
  orderId: string,
  reference: string
): Promise<OrangeMoneyPaymentResponse> => {
  const payload: OrangeMoneyPaymentRequest = {
    amount,
    currency: 'XOF',
    order_id: orderId,
    return_url: `${window.location.origin}/payment/success`,
    cancel_url: `${window.location.origin}/payment/cancel`,
    notif_url: `${import.meta.env.VITE_API_URL}/payment/orange-webhook`,
    lang: 'fr',
    reference,
  };

  const response = await fetch(`${ORANGE_MONEY_API_URL}/webpayment/v1/transactioninitialization`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ORANGE_MONEY_API_KEY}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Orange Money payment failed: ${error.message || 'Unknown error'}`);
  }

  return response.json();
};

export const checkOrangeMoneyPaymentStatus = async (paymentToken: string): Promise<any> => {
  const response = await fetch(
    `${ORANGE_MONEY_API_URL}/webpayment/v1/transactionstatus/${paymentToken}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ORANGE_MONEY_API_KEY}`,
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check Orange Money payment status');
  }

  return response.json();
};

/**
 * Helper to redirect user to Orange Money payment page
 */
export const redirectToOrangeMoneyPayment = (paymentUrl: string) => {
  window.location.href = paymentUrl;
};
