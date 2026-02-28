import axios from "axios";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "";
const KHALTI_PUBLIC_KEY = process.env.KHALTI_PUBLIC_KEY || "";
const KHALTI_ENVIRONMENT = process.env.KHALTI_ENVIRONMENT || "test";

const KHALTI_BASE_URL =
  KHALTI_ENVIRONMENT === "production"
    ? "https://khalti.com/api/v2"
    : "https://a.khalti.com/api/v2";

export interface CreateKhaltiPaymentParams {
  amount: number; // in paisa (smallest unit)
  purchaseOrderId: string;
  purchaseOrderName: string;
  returnUrl: string;
  websiteUrl: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

/**
 * Initialize Khalti payment
 */
export async function createKhaltiPayment(params: CreateKhaltiPaymentParams) {
  try {
    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      {
        return_url: params.returnUrl,
        website_url: params.websiteUrl,
        amount: Math.round(params.amount * 100), // Convert to paisa
        purchase_order_id: params.purchaseOrderId,
        purchase_order_name: params.purchaseOrderName,
        customer_info: params.customerInfo,
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      paymentUrl: response.data.payment_url,
      pidx: response.data.pidx,
      expiresAt: response.data.expires_at,
      expiresIn: response.data.expires_in,
    };
  } catch (error) {
    console.error("Khalti payment initiation failed:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to initiate Khalti payment",
      );
    }
    throw new Error("Failed to initiate Khalti payment");
  }
}

/**
 * Verify Khalti payment
 */
export async function verifyKhaltiPayment(pidx: string) {
  try {
    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      {
        pidx,
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      pidx: response.data.pidx,
      status: response.data.status,
      transactionId: response.data.transaction_id,
      amount: response.data.total_amount / 100, // Convert from paisa to rupees
      fee: response.data.fee / 100,
      refunded: response.data.refunded,
    };
  } catch (error) {
    console.error("Khalti payment verification failed:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to verify Khalti payment",
      );
    }
    throw new Error("Failed to verify Khalti payment");
  }
}

/**
 * Create Khalti refund
 */
export async function createKhaltiRefund(pidx: string, amount?: number) {
  try {
    const payload: { pidx: string; amount?: number } = { pidx };
    if (amount) {
      payload.amount = Math.round(amount * 100); // Convert to paisa
    }

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/refund/`,
      payload,
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      pidx: response.data.pidx,
      status: response.data.status,
      refundAmount: response.data.refund_amount / 100,
      transactionId: response.data.transaction_id,
    };
  } catch (error) {
    console.error("Khalti refund creation failed:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to create Khalti refund",
      );
    }
    throw new Error("Failed to create Khalti refund");
  }
}

/**
 * Get Khalti public key for frontend
 */
export function getKhaltiPublicKey(): string {
  return KHALTI_PUBLIC_KEY;
}

/**
 * Get Khalti environment
 */
export function getKhaltiEnvironment(): string {
  return KHALTI_ENVIRONMENT;
}
