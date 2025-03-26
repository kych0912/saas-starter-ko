import { Team } from "@/lib/db/schema";
import { ProductProductDTO } from "../types/Product";
import { getUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { redirect } from "next/navigation";
import { teams } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductOrderdto } from "../types/ProductOrder";
import { OrderV1DTO } from "../types/Order";

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
        throw new Error('Failed to create customer');
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