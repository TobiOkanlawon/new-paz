"use client";

declare global {
  interface Window {
    PaystackPop: {
      setup(config: PaystackConfig): { openIframe(): void };
    };
  }
}

export type PaystackConfig = {
  key: string;
  email: string;
  amount: number; // in kobo
  ref?: string;
  currency?: string;
  channels?: string[];
  metadata?: Record<string, unknown>;
  onSuccess: (reference: { reference: string; [key: string]: unknown }) => void;
  onClose: () => void;
};

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.head.appendChild(script);
  });
}

/**
 * Open the Paystack payment popup.
 * Loads the Paystack Inline JS SDK on demand — no npm package needed.
 */
export async function openPaystackPopup(config: PaystackConfig) {
  await loadScript();

  const handler = window.PaystackPop.setup({
    ...config,
    ref: config.ref ?? new Date().getTime().toString(),
  });

  handler.openIframe();
}
