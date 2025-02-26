import { insertBillingKey, getUser, getTeamForUser } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const user = await getUser();
    const { billingKey } = body;

    if(!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const team = await getTeamForUser(user.id);

    if(!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 401 });
    }

    await insertBillingKey(team.id, billingKey);
    return NextResponse.json({ success: true });
}

