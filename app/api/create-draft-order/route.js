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
        allow_discounts: true, // ✅ Enables discounts
        use_customer_default_address: true, // ✅ Helps Shopify treat it like a normal order
        send_invoice: true, // ✅ Generates an invoice email with discount options
      },
    };

    //
