import { NextRequest, NextResponse } from "next/server";
import SteppayWebhookUtil from "./Utils";
import { handleSubscriptionChange } from "@/lib/payments/steppay/steppay";
import { SubscriptionItem } from "@/lib/payments/types/Webhook";

export async function POST(request: NextRequest) {
    const signature = request.headers.get('Steppay-Signature');
    const payload = await request.text();
    const secret = process.env.STEPPAY_WEBHOOK_SECRET;

    if(!signature || !payload || !secret){
        console.error('Invalid request');
        return NextResponse.json({message: 'Invalid request'}, {status: 400});
    }

    const body = JSON.parse(payload);
    const data = body.data;
    let Event: string;

    try{
        SteppayWebhookUtil.verifySignature(signature, payload, secret);
        Event = body.event;
    }catch(error){
        console.error('invalid signature');
        return NextResponse.json({message: 'Invalid signature'}, {status: 400});
    }

    try{    
        switch(Event){
        case 'subscription.created':
            break;
        case 'subscription.updated':
            const subscription = data.items[0] as SubscriptionItem; 
            const status = data.status;
            await handleSubscriptionChange({subscription, status});
            break;
        }   
        return NextResponse.json({message: 'Webhook received'});
    }catch(error){
        return NextResponse.json({message: 'Error'}, {status: 500});
    }
}
