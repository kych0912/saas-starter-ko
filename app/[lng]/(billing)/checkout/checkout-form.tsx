"use client";

import { CheckoutButton } from "./checkout-button";
import { createBillingKey } from "@/lib/payments/portone-browser";
import { createPayMentsByBillingKeyAction } from "@/lib/payments/actions";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export function CheckoutForm({
  priceId,
}: {
  priceId: string;
}) {
  async function handleCheckout() {
    const redirectUrl = window.location.href;
    const billingKey = await createBillingKey({
      redirectUrl: redirectUrl,
    });
    const formData = new FormData();
    formData.append("billingKey", billingKey);
    formData.append("priceId", priceId);

    //발급 후 결제 진행
    await createPayMentsByBillingKeyAction(formData);
  }

  return (
    <form action={handleCheckout}>
      <input type="hidden" name="priceId" value={priceId} />
      <CheckoutButton/>
    </form>
  );
} 