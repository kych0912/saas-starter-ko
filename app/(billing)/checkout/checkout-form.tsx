"use client";

import { CheckoutButton } from "./checkout-button";
import { createBillingKey } from "@/lib/payments/portone-browser";
import { createPayMentsByBillingKeyAction } from "@/lib/payments/actions";
import { toast } from "sonner";

export function CheckoutForm({
  priceId,
}: {
  priceId: string;
}) {
  async function handleCheckout() {
    try{
      const redirectUrl = window.location.href;
      const billingKey = await createBillingKey({
        redirectUrl: redirectUrl,
      });
      const formData = new FormData();
      formData.append("billingKey", billingKey);
      formData.append("priceId", priceId);

      await createPayMentsByBillingKeyAction(formData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to checkout");
    }
  }


  return (
    <form action={handleCheckout}>
      <input type="hidden" name="priceId" value={priceId} />
      <CheckoutButton/>
    </form>
  );
} 