import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { cart } = await req.json();

    const SHOPIFY_STORE_URL = "https://cutie-balloons.myshopify.com";
    const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

    const cartDetails = cart
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");

    const totalCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

    const draftOrderPayload = {
      draft_order: {
        line_items: [
          {
            title: `Balloon Bouquet: ${cartDetails}`,
            price: totalCost,
            quantity: 1,
          },
        ],
      },
    };

    const response = await fetch(`${SHOPIFY_STORE_URL}/admin/api/2024-01/draft_orders.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify(draftOrderPayload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.errors ? JSON.stringify(data.errors) : "Failed to create draft order");
    }

    // ✅ THIS is what your frontend needs now:
    return NextResponse.json({ name: data.draft_order.name });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
