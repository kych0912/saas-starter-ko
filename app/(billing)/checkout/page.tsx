import { redirect } from "next/navigation";
import { AddCardButton } from "./add-card-button";
import { getPriceById, getProductById, getBillingKeysByTeamId } from "@/lib/db/queries";
import { BillingKeySelector } from "./billing-key-selector";
import { createPayMentsByBillingKeyAction } from "@/lib/payments/actions";
import { CheckoutButton } from "./checkout-button";
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ priceId?: string, teamId?: string }> }) {
    
    const { priceId, teamId } = await searchParams;
    
    if(!priceId || !teamId){
        redirect('/pricing');
    }

    const teamIdNumber = parseInt(teamId);

    if(!priceId){
        redirect('/pricing');
    }

    const price = await getPriceById(priceId);

    if(!price.productId){
        redirect('/pricing');
    }

    const product = await getProductById(price.productId);
    const billingKeys = await getBillingKeysByTeamId(teamIdNumber);
    return (
        <>
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold mb-2">결제 수단 선택</h2>
                {billingKeys.length > 0 ? (
                    <BillingKeySelector billingKeys={billingKeys}/>
                ) : (
                    <div className="p-4 bg-gray-100 rounded-md">
                        <p>등록된 결제 수단이 없습니다.</p>
                    </div>
                )}
            </div>
            <AddCardButton/>

            <div className="mt-6">
                <h1 className="text-xl font-bold">{product.name}</h1>
                <h2 className="text-lg">{price.trialPeriodDays} days free trial</h2>
                <h2 className="text-lg">{Number(price.unitAmount) / 100} {price.currency}</h2>
            </div>

            <form action={createPayMentsByBillingKeyAction}>
                <input type="hidden" name="priceId" value={priceId} />
                <input type="hidden" name="billingKey" value={billingKeys[0]?.key || ''} />
                <CheckoutButton disabled={billingKeys.length === 0}/>
            </form>
        </>
    )
}   

