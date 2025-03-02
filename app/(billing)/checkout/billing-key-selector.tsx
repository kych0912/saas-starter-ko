import { billingKeys } from '@/lib/db/schema'
import { getBillingKeyInfo } from '@/lib/payments/portone-server';
import { Card } from '@portone/server-sdk/common';
type BillingKey = typeof billingKeys.$inferSelect;


export async function BillingKeySelector({ 
  billingKeys, 
}: { 
  billingKeys: BillingKey[], 
}) {
    const billingKeyInfo = await getBillingKeyInfo(billingKeys[0].key);
    let cardInfo:Card = {
        brand: '',
        number: '',
    }

    if(billingKeyInfo.status !== 'ISSUED') {
        return (
            <div>
                <button onClick={() => {
                    window.location.reload();
                }}>
                    다시 시도하기
                </button>   
            </div>
        )
    }

    if(billingKeyInfo.methods?.[0].type === 'BillingKeyPaymentMethodCard') {
        cardInfo = {
            brand: billingKeyInfo.methods?.[0].card?.brand,
            number: billingKeyInfo.methods?.[0].card?.number,
        }
    }

    return (
    <div className="space-y-4">
        <div className="space-y-2">
            {billingKeys.map((billingKey) => (
            <div 
                key={billingKey.id}
                className={`p-3 border rounded-md cursor-pointer border-gray-200`}
            >
                <div className="flex items-center gap-3">
                <label 
                    htmlFor={`billing-key-${billingKey.id}`}
                    className="flex-1 cursor-pointer"
                >
                    {cardInfo.brand} {cardInfo.number}
                </label>
                </div>
            </div>
            ))}
        </div>
    </div>
  )
} 