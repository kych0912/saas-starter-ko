'use client'
import { createPayMentsByBillingKeyAction } from "@/lib/payments/actions";
import { useEffect } from "react";
import { toast } from "sonner";

export function MobileCheckout({billingKey, priceId}: {
    billingKey: string | undefined, 
    priceId: string 
}){
    useEffect(() => {
        if(!billingKey || !priceId){
            return;
        }

        const formData = new FormData();
        formData.append("billingKey", billingKey);
        formData.append("priceId", priceId);

        setTimeout(() => {
            toast.promise(createPayMentsByBillingKeyAction(formData), {
                loading: "Loading...",
                success: "Success",
            });
        }, 0);

    }, [billingKey, priceId]);

    return null;
}
