'use client';

import { Button } from "@/components/ui/button";    
import { createBillingKeyAndPayment } from "@/lib/payments/portone";

export function AddCardButton({ priceId, teamId }: { priceId: string, teamId: number }) {
    return <Button onClick={() => {
        createBillingKeyAndPayment(priceId, window.location.href);
    }}>Checkout</Button>;
}
