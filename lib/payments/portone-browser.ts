import * as PortOne from "@portone/browser-sdk/v2";

export async function createBillingKey({priceId}:{priceId:string}) {

    const issueResponse = await PortOne.requestIssueBillingKey({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: "channel-key-ab41dd63-057e-41e5-ac2d-4ecd842ce9da",
        billingKeyMethod: "CARD",
        issueId: "issue-id-1234567890",
        issueName: "월간 이용권 정기결제",
        customer:{
            customerId: "customer-id-1234567890",
        },
    });

    if (!issueResponse || issueResponse.code !== undefined) {
        throw new Error(issueResponse?.message || "Failed to create billing key");
    }
    const billingKey = issueResponse.billingKey;
    const response = await fetch(`/api/portone/billingkey`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingKey: billingKey }),
    });

    if (!response.ok) {
        throw new Error("Failed to create billing key");
    }

    return billingKey;
}
