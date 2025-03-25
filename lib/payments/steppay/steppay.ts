
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