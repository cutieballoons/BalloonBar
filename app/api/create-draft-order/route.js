import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { cart } = await req.json();

    // Shopify Store Credentials
    const SHOPIFY_STORE_URL = "https://cutie-balloons.myshopify.com";
    const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

    // Create line items from the cart, setting "Pastel Pink Latex" to $0 for testing
    const lineItems = cart.map((item) => ({
      title: item.name,
      price: item.name === "Pastel Pink Latex" ? 0.0 : item.price, // Set Pastel Pink Latex to $0
      quantity: item.quantity,
    }));

    const totalCost = cart.reduce((acc, item) => acc + (item.name === "Pastel Pink Latex" ? 0 : item.price) * item.quantity, 0).toFixed(2);

    const draftOrderPayload = {
      draft_order: {
        line_items: lineItems,
        allow_discounts: true, // ✅ Enables discounts
        use_customer_default_address: true, // ✅ Helps Shopify treat it like a normal order
        send_invoice: true, // ✅ Generates an invoice email with discount options
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
