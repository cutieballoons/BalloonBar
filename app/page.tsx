"use client";
import React, { useState } from "react";
import { ShoppingCart, Trash } from "lucide-react";
import QRCode from "react-qr-code";

const balloons = [
  { id: 1, name: "Pastel Blue Latex", price: 0 },
  { id: 2, name: "Sage Yellow Latex", price: 0 },
  { id: 3, name: "Gold Foil Star", price: 6.5 },
  { id: 4, name: "Number '5' Gold", price: 8.0 },
];

export default function BalloonBar() {
  const [cart, setCart] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [checkoutURL, setCheckoutURL] = useState("");

  const addToCart = (balloon) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === balloon.id);
      if (existing) {
        return prev.map((item) =>
          item.id === balloon.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...balloon, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const generateCheckout = async () => {
    const response = await fetch("/api/create-draft-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });

    const data = await response.json();
    if (data.checkoutUrl) {
      setCheckoutURL(data.checkoutUrl);
      setShowQR(true);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎈 Build Your Balloon Bouquet 🎈</h1>
      <div className="grid grid-cols-2 gap-4">
        {balloons.map((balloon) => (
          <div key={balloon.id} className="border p-4 rounded-lg text-center cursor-pointer" onClick={() => addToCart(balloon)}>
            <h2 className="font-semibold">{balloon.name}</h2>
            <p className="text-sm text-gray-600">${balloon.price.toFixed(2)}</p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => addToCart(balloon)}>Add</button>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-semibold">🛒 Your Custom Bouquet</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">No balloons selected.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                {item.name} (x{item.quantity}) - ${item.price * item.quantity}
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeFromCart(item.id)}>
                  <Trash size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <h3 className="text-lg font-bold mt-4">Total: ${totalCost.toFixed(2)}</h3>
        <button className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded" onClick={generateCheckout}>
          Generate QR for Checkout
        </button>
        {showQR && (
          <div className="mt-4 p-4 border rounded-lg text-center">
            <p className="mb-2">Show this QR at checkout:</p>
            <QRCode value={checkoutURL} size={150} />
          </div>
        )}
      </div>
    </div>
  );
}
