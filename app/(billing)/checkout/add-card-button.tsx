'use client';

import { Button } from "@/components/ui/button";    
import { createBillingKey } from "@/lib/payments/portone-browser";

export function AddCardButton() {
    return <Button onClick={() => {
        createBillingKey();
    }}>{"ADD PAYMENT METHOD"}</Button>;
}
