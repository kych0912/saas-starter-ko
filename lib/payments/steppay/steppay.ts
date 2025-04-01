import { Team } from "@/lib/db/schema";
import { ProductProductDTO } from "../types/Product";
import { getUser, updateTeamSubscription } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { redirect } from "next/navigation";
import { teams } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductOrderdto } from "../types/ProductOrder";
import { OrderSubscriptionV1DTO, OrderV1DTO } from "../types/Order";
import { SubscriptionItem } from "../types/Webhook";

export async function createCustomer({
    name,
    email
}:{
    name: string,
    email: string
}){
    const response = await fetch('https://api.steppay.kr/api/v1/customers',{
        method:'POST',
        headers:{
            "Secret-Token": process.env.STEPPAY_SECRET_KEY!,
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
        body: JSON.stringify({
            name:name,
            email,
        })
    })

    const data = await response.json();
    
    if(!response.ok){
        redirect('/pricing?error=failed_to_create_customer');
    }

    return data;
}

export async function getStepPayProductCode():Promise<string>{
    const product = await fetch('https://api.steppay.kr/api/v1/products',{
        method:'GET',
        headers:{
            "Secret-Token": process.env.STEPPAY_SECRET_KEY!,
            "Content-Type": "application/json",
            "Accept": "*/*",
        }
    })

    const data = await product.json();
    const productCode = data.content[0].code;

    return productCode;
}

export async function getStepPayProducts(productCode:string):Promise<ProductProductDTO>{
    const product = await fetch(`https://api.steppay.kr/api/v1/products/${productCode}`,{
        method:'GET',
        headers:{
            "Secret-Token": process.env.STEPPAY_SECRET_KEY!,
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
    })

    const data = await product.json();

    return data;
}

export async function createCheckout({team, productCode, priceCode}:{
    team: Team, 
    productCode: string, 
    priceCode: string
}):Promise<ProductOrderdto>{
    const user = await getUser();  
    let stepPayCustomerId = team.stepPayCustomerId;

    if(!user){
        redirect(`/sign-up?redirect=checkout&priceId=${priceCode}`);
    }

    if(!stepPayCustomerId){
        const customer = await createCustomer({
            name: team.name!,
            email: user.email,
        });

        await db.update(teams)
        .set({stepPayCustomerId: customer.id})
        .where(eq(teams.id, team.id));

        stepPayCustomerId = customer.id;
    }

    const response = await fetch('https://api.steppay.kr/api/v1/orders',{
        method:'POST',
        headers:{
            "Secret-Token": process.env.STEPPAY_SECRET_KEY!,
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
        body: JSON.stringify({
            customerId: stepPayCustomerId,
            items:[    {
                "minimumQuantity": 1,
                "productCode": productCode,
                "priceCode": priceCode
            }]
        })
    })

    if(!response.ok){
        redirect('/pricing?error=failed_to_create_checkout');
    }

    const data = await response.json();
    return data;
}   

export async function redirectToCheckout(idOrCode:string){

    const response = await fetch(`https://api.steppay.kr/api/v1/orders/${idOrCode}/pay?cancelUrl=${process.env.BASE_URL}/pricing&successUrl=${process.env.BASE_URL}/api/steppay/checkout&errorUrl=${process.env.BASE_URL}/pricing`,{
        method:'GET',
        headers:{
            "Secret-Token": process.env.STEPPAY_SECRET_KEY!,
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
        redirect: 'manual'
    })
    if(response.status === 302){
        const location = response.headers.get('Location');
        redirect(location!);
    }

    const data = await response.json();
    return data;
}

export async function getOrder(orderCode:string):Promise<OrderV1DTO>{
    const response = await fetch(`https://api.steppay.kr/api/v1/orders/${orderCode}`,{
        method:'GET',
        headers:{
            "Secret-Token": process.env.STEPPAY_SECRET_KEY!,
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
    })

    const data = await response.json() as OrderV1DTO;
    return data;
}

export async function createCustomPortalSession(team:Team):Promise<string>{ 

    const customerId = team.stepPayCustomerId;

    if(!customerId){
        redirect('/pricing');
    }
    const response = await fetch(`https://api.steppay.kr/api/v1/session/${customerId}`,{
        method:"GET",
        headers:{
            "Secret-Token": process.env.STEPPAY_SECRET_KEY!,
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
    })

    if(!response.ok){
        redirect('/pricing?error=failed_to_create_portal_session');
    }

    const data = await response.text();
    return data;
}

export async function getSubscription(subscriptionId:string):Promise<OrderSubscriptionV1DTO>{
    const response = await fetch(`https://api.steppay.kr/api/v1/subscriptions/${subscriptionId}`,{
        method:'GET',
        headers:{
            "Secret-Token": process.env.STEPPAY_SECRET_KEY!,
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
    })
    const data = await response.json() as OrderSubscriptionV1DTO;
    return data;
}

enum SubscriptionStatus{    
    ACTIVE = 'ACTIVE',
    INCOMPLETE = 'INCOMPLETE',
    UNPAID = 'UNPAID',
    PENDING_PAUSE = 'PENDING_PAUSE',
    PAUSE = 'PAUSE',
    PENDING_CANCEL = 'PENDING_CANCEL',
    EXPIRED = 'EXPIRED',
    CANCELED = 'CANCELED',
    QUEUEING = 'QUEUEING',
}

interface ISubscriptionChange{
    subscription: SubscriptionItem;
    status: SubscriptionStatus;
}

export async function handleSubscriptionChange({
    subscription,
    status
}:ISubscriptionChange){
    const subscriptionId = subscription.subscriptionItemId.toString();
    const subscriptionItem = await getSubscription(subscriptionId);

    const priceCode = subscriptionItem.items[0].priceCode;
    const productCode = subscriptionItem.items[0].productCode;
    const planName = subscriptionItem.items[0].plan.name;

    if(!priceCode || !productCode || !planName){
        throw new Error('Price code or product code or plan name not found');
    }

    const team = await db
        .select()
        .from(teams)
        .where(eq(teams.stepPaySubscriptionId, subscriptionId)).limit(1)
        
    if(team.length === 0 || !team[0]){
        throw new Error('Team not found');
    }

    const selectedTeam = team[0];

    if(status === SubscriptionStatus.ACTIVE){
        await updateTeamSubscription({
            teamid: selectedTeam.id,    
            subscriptionStatus: status,
            stepPaySubscriptionId: subscriptionId,
            planName: planName,
            stepPayProductCode: productCode,
            stepPayPriceCode: priceCode,
            updatedAt: new Date(),
        })
    }else if(status === SubscriptionStatus.CANCELED || status === SubscriptionStatus.UNPAID || status === SubscriptionStatus.EXPIRED){   
        await updateTeamSubscription({
            teamid: selectedTeam.id,    
            subscriptionStatus: status,
            stepPaySubscriptionId: null,
            planName: null,
            stepPayProductCode: null,
            stepPayPriceCode: null,
            updatedAt: new Date(),
        })
    }


}