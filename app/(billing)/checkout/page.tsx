import { redirect } from "next/navigation";
import { getPriceById, getProductById } from "@/lib/db/queries";
import { CheckoutForm } from "./checkout-form";
import { MobileCheckout } from "./mobile-checkout";
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ priceId?: string, teamId?: string, billingKey?: string }> }) {
    
    const { priceId, teamId, billingKey } = await searchParams;
    
    if(!priceId || !teamId){
        redirect('/pricing');
    }

    const price = await getPriceById(priceId);

    if(!price.productId){
        redirect('/pricing');
    }

    const product = await getProductById(price.productId);

    return (
        <>
            <div className="mt-6">
                <h1 className="text-xl font-bold">{product.name}</h1>
                <h2 className="text-lg">{price.trialPeriodDays} days free trial</h2>
                <h2 className="text-lg">{Number(price.unitAmount) / 100} {price.currency}</h2>
            </div>

            <CheckoutForm priceId={priceId}/>
            <MobileCheckout billingKey={billingKey} priceId={priceId}/>
        </>
    )
}   

