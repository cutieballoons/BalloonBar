"use client";
import React, { useState } from "react";
import { ShoppingCart, Trash } from "lucide-react";
import QRCode from "react-qr-code";
import "./styles.css";

const balloons = [
  { id: 1, name: "Standard White", price: 0 },
  { id: 2, name: "Pearl White", price: 0 },
  { id: 3, name: "Diamond Clear", price: 0 },
  { id: 4, name: "Onyx Black", price: 0 },
  { id: 5, name: "Rose Gold", price: 0 },
  { id: 6, name: "Standard Pink", price: 0 },
  { id: 7, name: "Chrome Gold", price: 0 },
  { id: 8, name: "Chrome Silver", price: 0 },
  { id: 9, name: "Chrome Champagne", price: 0 },
  { id: 10, name: "Reflex Rose Gold", price: 0 },
  { id: 11, name: "Chrome Blue", price: 0 },
  { id: 12, name: "Chrome Green", price: 0 },
  { id: 13, name: "Chrome Purple", price: 0 },
  { id: 14, name: "Chrome Fuchsia", price: 0 },
  { id: 15, name: "Chrome Red", price: 0 },
  { id: 16, name: "Metallic Gold", price: 0 },
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