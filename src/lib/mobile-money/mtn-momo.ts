/**
 * MTN Mobile Money Payment Integration
 * Documentation: https://momodeveloper.mtn.com/
 */

export interface MTNMomoPaymentRequest {
  amount: string;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string; // Phone number
  };
  payerMessage: string;
  payeeNote: string;
}

export interface MTNMomoPaymentResponse {
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  financialTransactionId?: string;
  externalId: string;
  amount: string;
  currency: string;
  reason?: string;
}

const MTN_MOMO_API_URL = import.meta.env.MTN_MOMO_API_URL || '';
const MTN_MOMO_SUBSCRIPTION_KEY = import.meta.env.MTN_MOMO_SUBSCRIPTION_KEY || '';
const MTN_MOMO_API_USER = import.meta.env.MTN_MOMO_API_USER || '';
const MTN_MOMO_API_KEY = import.meta.env.MTN_MOMO_API_KEY || '';

/**
 * Generate access token for MTN MoMo API
 */
const getMTNAccessToken = async (): Promise<string> => {
  const credentials = btoa(`${MTN_MOMO_API_USER}:${MTN_MOMO_API_KEY}`);

  const response = await fetch(`${MTN_MOMO_API_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Ocp-Apim-Subscription-Key': MTN_MOMO_SUBSCRIPTION_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get MTN MoMo access token');
  }

  const data = await response.json();
  return data.access_token;
};

/**
 * Request payment from customer
 */
export const requestMTNMomoPayment = async (
  amount: number,
  phoneNumber: string,
  externalId: string,
  payerMessage: string
): Promise<string> => {
  const accessToken = await getMTNAccessToken();
  const referenceId = crypto.randomUUID();

  const payload: MTNMomoPaymentRequest = {
    amount: amount.toString(),
    currency: 'XOF',
    externalId,
    payer: {
      partyIdType: 'MSISDN',
      partyId: phoneNumber.replace(/\D/g, ''), // Remove non-digits
    },
    payerMessage,
    payeeNote: 'Andoh & Dohgad Consulting - Document Purchase',
  };

  const response = await fetch(`${MTN_MOMO_API_URL}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': 'mtnivorycoast', // Change based on environment
      'Ocp-Apim-Subscription-Key': MTN_MOMO_SUBSCRIPTION_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`MTN MoMo payment failed: ${error.message || 'Unknown error'}`);
  }

  return referenceId;
};

/**
 * Check payment status
 */
export const checkMTNMomoPaymentStatus = async (
  referenceId: string
): Promise<MTNMomoPaymentResponse> => {
  const accessToken = await getMTNAccessToken();

  const response = await fetch(
    `${MTN_MOMO_API_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Target-Environment': 'mtnivorycoast',
        'Ocp-Apim-Subscription-Key': MTN_MOMO_SUBSCRIPTION_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check MTN MoMo payment status');
  }

  return response.json();
};

/**
 * Poll payment status until completed or failed
 */
export const pollMTNMomoPaymentStatus = async (
  referenceId: string,
  maxAttempts = 30,
  interval = 2000
): Promise<MTNMomoPaymentResponse> => {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkMTNMomoPaymentStatus(referenceId);

    if (status.status === 'SUCCESSFUL' || status.status === 'FAILED') {
      return status;
    }

    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error('Payment status check timeout');
};
