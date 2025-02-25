declare module '@cashfreepayments/cashfree-js' {
  interface CheckoutOptions {
    paymentSessionId: string;
    returnUrl: string;
  }

  interface PaymentResult {
    error?: {
      message: string;
    };
    success?: boolean;
  }

  interface CashfreeConfig {
    mode: "sandbox" | "production";
  }

  interface CashfreeInstance {
    checkout: (options: CheckoutOptions) => Promise<PaymentResult>;
  }

  // Add global window type
  global {
    interface Window {
      Cashfree: {
        new (config: CashfreeConfig): CashfreeInstance;
      }
    }
  }

  export function load(options?: { mode: "sandbox" | "production" }): Promise<CashfreeInstance>;
} 