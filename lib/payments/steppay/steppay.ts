import { ProductProductDTO } from "../types/Product";

export async function createCustomer({
    email
}:{
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
            name: email,
            email,
        })
    })

    const data = await response.json();
    
    if(!response.ok){
        return{
            error: 'Failed to create customer',
            isError: true,
        }
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
