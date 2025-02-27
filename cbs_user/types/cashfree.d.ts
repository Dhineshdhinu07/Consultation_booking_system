declare module '@cashfreepayments/cashfree-js' {
  interface CheckoutOptions {
    paymentSessionId: string;
    returnUrl: string;
  }

  interface PaymentResult {
    error?: {
      message: string;
      code?: string;
    };
    success?: boolean;
  }

  interface CashfreeConfig {
    mode: "sandbox" | "production";
  }

  interface CashfreeInstance {
    checkout: (options: CheckoutOptions) => Promise<PaymentResult>;
  }

  export function load(options?: { mode: "sandbox" | "production" }): Promise<CashfreeInstance>;
}

// Declare global Cashfree type
declare global {
  interface Window {
    Cashfree: {
      new (config: CashfreeConfig): CashfreeInstance;
    }
  }
} 