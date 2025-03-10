import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { cart } = await req.json();

    // Shopify Store Credentials
    const SHOPIFY_STORE_URL = "https://cutie-balloons.myshopify.com";
    const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

    // Create a readable summary of selected balloons
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

    // Send request to Shopify API
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

    return NextResponse.json({ checkoutUrl: data.draft_order.invoice_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
