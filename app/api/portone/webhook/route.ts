import { NextRequest, NextResponse } from "next/server";
import * as PortOne from "@portone/server-sdk";
import { WebhookUnbrandedRequiredHeaders } from "@portone/server-sdk/webhook";
import { getPriceById, getProductById, getBillingKeysByTeamId } from "@/lib/db/queries";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { session, teams } from "@/lib/db/schema";
import { createCheckoutSchedule } from "@/lib/payments/portone-server";
import { v4 as uuidv4 } from 'uuid';
const portone = PortOne.PortOneClient({
    secret: process.env.PORTONE_SECRET_KEY!,
});

//Verify Payment Webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headers: WebhookUnbrandedRequiredHeaders = {
      "webhook-id": req.headers.get("webhook-id")!,
      "webhook-timestamp": req.headers.get("webhook-timestamp")!,
      "webhook-signature": req.headers.get("webhook-signature")!,
    };

    // 웹훅 메시지를 검증합니다.
    const webhook = await PortOne.Webhook.verify(
      process.env.PORTONE_WEBHOOK_SECRET!,
      body,
      headers,
    );
    console.log(webhook);

    // 결제 관련 정보일 경우만 처리합니다.
    if ( "data" in webhook && "paymentId" in webhook.data) {
      const { paymentId } = webhook.data;
      const paymentResponse = await portone.payment.getPayment({ paymentId: paymentId });

      if (paymentResponse === null || !("id" in paymentResponse)) {
        // 웹훅 정보와 일치하는 결제건이 실제로는 존재하지 않는 경우 
        return NextResponse.json({ message: "Payment not found" }, { status: 200 });
      }

      const { status, amount } = paymentResponse;
      const pyamentId = webhook.data.paymentId;
      
      const _session = await db.select().from(session).where(eq(session.paymentId, pyamentId));

      if(!_session){
        return NextResponse.json(
          { message: "Session not found" }, 
          { status: 400 }
        );
      }
      
      const price = await getPriceById(_session[0].priceId);
      const product = await getProductById(_session[0].productId);
      const billingKey = await getBillingKeysByTeamId(_session[0].teamId);
      
      if (Number(price.unitAmount) * 100 === amount.total) {
        switch (status) {
          case "PAID": {
            const uuid = uuidv4();
            //schedule 생성
            const [schedule,_] = await createCheckoutSchedule({
              teamId: _session[0].teamId.toString(),
              customerId: _session[0].customerId,
              priceId: _session[0].priceId,
              billingKey: billingKey.key,
              period: price.interval || 30,
              paymentId: uuid
            });

            const schduleId = schedule.schedule.id;
            //team 정보 업데이트
            await db.update(teams).set({
              subscriptionStatus: 'active',
              subscriptionId: schduleId,
              productId: _session[0].productId,
              planName: product.name,
              shouldTrial: false,
            }).where(eq(teams.id, _session[0].teamId));
            
            break;
          }

          default:{
            await db.update(teams).set({
              subscriptionStatus: 'canceled',
              subscriptionId: null,
              productId: null,
              planName: null,
              shouldTrial: false,
            }).where(eq(teams.id, _session[0].teamId));
            break;
          }
        }
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        // 결제 금액이 불일치하여 위/변조 시도가 의심됩니다.
        return NextResponse.json(
          { message: "Payment amount mismatch" }, 
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    if (error instanceof PortOne.Webhook.WebhookVerificationError) {
      return NextResponse.json(
        { message: "Webhook verification failed" }, 
        { status: 400 }
      );
    }
    
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}

