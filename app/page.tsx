"use client";
import React, { useState } from "react";
import { ShoppingCart, Trash } from "lucide-react";
import QRCode from "react-qr-code";
import "./styles.css";

const balloons = [
  { id: 1, name: "Diamond Clear", price: 3.25 },
  { id: 2, name: "White", price: 3.25 },
  { id: 3, name: "Pearl White", price: 0 },
  { id: 4, name: "Gray", price: 3.25 },
  { id: 5, name: "Pearl Ivory", price: 3.25 },
  { id: 6, name: "Pastel Yellow", price: 3.25 },
  { id: 7, name: "Pearl Lemon Chiffon", price: 3.25 },
  { id: 8, name: "Yellow", price: 3.25 },
  { id: 9, name: "Goldenrod", price: 3.25 },
  { id: 10, name: "Gold", price: 3.25 },
  { id: 11, name: "Blush", price: 3.25 },
  { id: 12, name: "White Sand", price: 3.25 },
  { id: 13, name: "Cream", price: 3.25 },
  { id: 14, name: "Chrome Champagne", price: 3.25 },
  { id: 15, name: "Mocha Brown", price: 3.25 },
  { id: 16, name: "Chocolate Brown", price: 3.25 },
  { id: 17, name: "Rosewood", price: 3.25 },
  { id: 18, name: "Pearl Peach", price: 3.25 },
  { id: 19, name: "Rose Gold", price: 3.25 },
  { id: 20, name: "Melon", price: 3.25 },
  { id: 21, name: "Coral", price: 3.25 },
  { id: 22, name: "Orange", price: 3.25 },
  { id: 23, name: "Pearl Mandarin Orange", price: 3.25 },
  { id: 24, name: "Pearl Pink", price: 3.25 },
  { id: 25, name: "Pink", price: 3.25 },
  { id: 26, name: "Rose", price: 3.25 },
  { id: 27, name: "Wild Berry", price: 3.25 },
  { id: 28, name: "Pearl Magenta", price: 3.25 },
  { id: 29, name: "Fuchsia", price: 3.25 },
  { id: 30, name: "Chrome Fuchsia", price: 3.25 },
  { id: 31, name: "Pearl Burgundy", price: 3.25 },
  { id: 32, name: "Chrome Red", price: 3.25 },
  { id: 33, name: "Red", price: 3.25 },
  { id: 34, name: "Pastel Lilac", price: 3.25 },
  { id: 35, name: "Pearl Lavender", price: 3.25 },
  { id: 36, name: "Spring Lilac", price: 3.25 },
  { id: 37, name: "Purple Violet", price: 3.25 },
  { id: 38, name: "Pastel Blue", price: 3.25 },
  { id: 39, name: "Pearl Azure", price: 3.25 },
  { id: 40, name: "Pale Blue", price: 3.25 },
  { id: 41, name: "Caribbean Blue", price: 3.25 },
  { id: 42, name: "Tropical Teal", price: 3.25 },
  { id: 43, name: "Dark Blue", price: 3.25 },
  { id: 44, name: "Pearl Midnight Blue", price: 3.25 },
  { id: 45, name: "Eucalyptus", price: 3.25 },
  { id: 46, name: "Pastel Green", price: 3.25 },
  { id: 47, name: "Pearl Mint Green", price: 3.25 },
  { id: 48, name: "Wintergreen", price: 3.25 },
  { id: 49, name: "Lime Green", price: 3.25 },
  { id: 50, name: "Pearl Lime Green", price: 3.25 },
  { id: 51, name: "Spring Green", price: 3.25 },
  { id: 52, name: "Green", price: 3.25 },
  { id: 53, name: "Emerald Green", price: 3.25 },
  { id: 54, name: "Pearl Emerald Green", price: 3.25 },
  { id: 55, name: "Black", price: 3.25 },
  { id: 56, name: "Chrome Silver", price: 3.25 },
  { id: 57, name: "Chrome Gold", price: 3.25 },
  { id: 58, name: "Chrome Rose Gold", price: 3.25 },
  { id: 59, name: "Chrome Purple", price: 3.25 },
  { id: 60, name: "Chrome Blue", price: 3.25 },
  { id: 61, name: "Chrome Green", price: 3.25 },
];

export default function BalloonBar() {
  const [cart, setCart] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [checkoutURL, setCheckoutURL] = useState("");

  const addToCart = (balloon, event) => {
    event.stopPropagation(); // Prevents accidental double-click issues
    setCart((prev) => {
      return prev.map((item) =>
        item.id === balloon.id ? { ...item, quantity: item.quantity + 1 } : item
      ).concat(prev.some((item) => item.id === balloon.id) ? [] : { ...balloon, quantity: 1 });
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
    <div className="container">
      <h1 className="title">🎈 Build Your Balloon Bouquet 🎈</h1>
        <div className="balloon-grid">
          {balloons.map((balloon) => {
            const imageName = balloon.name.toLowerCase().replace(/ /g, "-") + ".jpg";
            const imageUrl = `/balloons/${imageName}`;

            return (
              <div key={balloon.id} className="balloon-item">
                <img
                  src={imageUrl}
                  alt={balloon.name}
                  className="balloon-image"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <h2>{balloon.name}</h2>
                <p>${balloon.price.toFixed(2)}</p>
                <button onClick={(event) => addToCart(balloon, event)}>Add</button>
              </div>
            );
          })}
        </div>
      <div className="cart">
        <h2>🛒 Your Custom Bouquet</h2>
        {cart.length === 0 ? (
          <p>No balloons selected.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} (x{item.quantity}) - ${item.price * item.quantity}
                <button onClick={() => removeFromCart(item.id)}><Trash size={14} /></button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${totalCost.toFixed(2)}</h3>
        <button onClick={generateCheckout}>Generate QR for Checkout</button>
        {showQR && (
          <div className="qr-container">
            <p>Show this QR at checkout:</p>
            <QRCode value={checkoutURL} size={150} />
          </div>
        )}
      </div>
    </div>
  );
}