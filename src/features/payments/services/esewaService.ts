import crypto from "crypto";
import axios from "axios";

const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || "";
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "";
const ESEWA_ENVIRONMENT = process.env.ESEWA_ENVIRONMENT || "test";

const ESEWA_BASE_URL =
  ESEWA_ENVIRONMENT === "production"
    ? "https://esewa.com.np/epay"
    : "https://uat.esewa.com.np/epay";

export interface CreateEsewaPaymentParams {
  amount: number;
  transactionId: string;
  productName: string;
  successUrl: string;
  failureUrl: string;
}

/**
 * Generate eSewa payment signature
 */
function generateEsewaSignature(data: string): string {
  return crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(data)
    .digest("base64");
}

/**
 * Create eSewa payment request
 * Returns the payment URL and form data
 */
export function createEsewaPayment(params: CreateEsewaPaymentParams) {
  const { amount, transactionId, productName, successUrl, failureUrl } = params;

  // eSewa expects amount in paisa (multiply by 100)
  const totalAmount = amount.toFixed(2);
  const taxAmount = "0";
  const serviceCharge = "0";
  const deliveryCharge = "0";

  // Generate signature
  const signatureData = `total_amount=${totalAmount},transaction_uuid=${transactionId},product_code=${ESEWA_MERCHANT_ID}`;
  const signature = generateEsewaSignature(signatureData);

  const paymentData = {
    amt: totalAmount,
    psc: serviceCharge,
    pdc: deliveryCharge,
    txAmt: taxAmount,
    tAmt: totalAmount,
    pid: transactionId,
    scd: ESEWA_MERCHANT_ID,
    su: successUrl,
    fu: failureUrl,
  };

  return {
    paymentUrl: `${ESEWA_BASE_URL}/main`,
    paymentData,
    signature,
  };
}

/**
 * Verify eSewa payment
 */
export async function verifyEsewaPayment(
  transactionId: string,
  refId: string,
  amount: number,
): Promise<boolean> {
  try {
    const verifyUrl = `${ESEWA_BASE_URL}/transrec`;

    const response = await axios.get(verifyUrl, {
      params: {
        amt: amount.toFixed(2),
        rid: refId,
        pid: transactionId,
        scd: ESEWA_MERCHANT_ID,
      },
    });

    // eSewa returns XML response
    const responseText = response.data;

    // Check if payment is successful
    // eSewa returns response_code "Success" for successful payments
    return (
      responseText.includes("<response_code>Success</response_code>") ||
      responseText.includes('"response_code":"Success"')
    );
  } catch (error) {
    console.error("eSewa payment verification failed:", error);
    return false;
  }
}

/**
 * Create eSewa refund request
 * Note: eSewa refunds are typically handled manually through merchant portal
 */
export async function createEsewaRefund(transactionId: string, amount: number) {
  // eSewa doesn't have automated refund API
  // Refunds need to be processed through merchant portal
  console.log(
    `Refund request for eSewa transaction ${transactionId} amount ${amount}`,
  );
  console.log("Please process refund through eSewa merchant portal");

  return {
    success: false,
    message: "eSewa refunds must be processed manually through merchant portal",
    transactionId,
    amount,
  };
}

/**
 * Get eSewa payment form HTML
 * This generates an HTML form that can be auto-submitted
 */
export function getEsewaPaymentFormHtml(
  params: CreateEsewaPaymentParams,
): string {
  const { paymentUrl, paymentData } = createEsewaPayment(params);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Redirecting to eSewa...</title>
    </head>
    <body>
      <form id="esewaForm" action="${paymentUrl}" method="POST">
        <input type="hidden" name="amt" value="${paymentData.amt}">
        <input type="hidden" name="psc" value="${paymentData.psc}">
        <input type="hidden" name="pdc" value="${paymentData.pdc}">
        <input type="hidden" name="txAmt" value="${paymentData.txAmt}">
        <input type="hidden" name="tAmt" value="${paymentData.tAmt}">
        <input type="hidden" name="pid" value="${paymentData.pid}">
        <input type="hidden" name="scd" value="${paymentData.scd}">
        <input type="hidden" name="su" value="${paymentData.su}">
        <input type="hidden" name="fu" value="${paymentData.fu}">
      </form>
      <script>
        document.getElementById('esewaForm').submit();
      </script>
      <p>Redirecting to eSewa payment gateway...</p>
    </body>
    </html>
  `;
}
