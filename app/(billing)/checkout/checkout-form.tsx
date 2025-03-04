"use client";

import { CheckoutButton } from "./checkout-button";
import { createBillingKey } from "@/lib/payments/portone-browser";
import { createPayMentsByBillingKeyAction } from "@/lib/payments/actions";

export function CheckoutForm({
  priceId,
}: {
  priceId: string;
}) {
  
  async function handleCheckout() {
      const billingKey = await createBillingKey({priceId});

      const formData = new FormData();
      formData.append("billingKey", billingKey);
      formData.append("priceId", priceId);

      await createPayMentsByBillingKeyAction(formData);
  }

  return (
    <form action={handleCheckout}>
      <input type="hidden" name="priceId" value={priceId} />
      <CheckoutButton/>
    </form>
  );
} 