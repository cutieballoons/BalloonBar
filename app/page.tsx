"use client";
import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import "./styles.css";
import { useSearchParams } from "next/navigation";

const latexBalloons = [
  { id: 1, name: "Crystal Clear", price: 3.25, variantId: 46856153039104 },
  { id: 2, name: "White", price: 3.25, variantId: 46855513047296 },
  // ... other latex balloons with accurate variantIds
];

const foilBalloons = [
  { id: 101, name: "Happy Birthday Star", price: 15, category: "Shapes" },
  // ... other foil balloons
];

const weights = [
  { id: 201, name: "Rose Gold Weight", price: 2.25, variantId: 46856157757696 },
  { id: 202, name: "Gold Weight", price: 2.25, variantId: 46856106639616 },
  { id: 203, name: "Silver Weight", price: 2.25, variantId: 46856106639616 },
  { id: 204, name: "Black Weight", price: 2.25, variantId: 46856106639616 }
];

const balloonImageClass = (balloon) => {
  return balloon.category ? "balloon-image foil" : "balloon-image latex";
};

function CartSection({ cart, addToCart, decreaseQty, removeFromCart, saveBouquet, totalCost, mode }) {
  return (
    <div className="cart sticky-cart">
      <h2>Your Custom Bouquet 🚖</h2>
      {cart.length === 0 ? (
        <p>No balloons selected.</p>
      ) : (
        <ul>
          {cart.map((item) => {
            const imageName = item.name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-") + ".jpg";
            const imageFolder = item.category ? "foils" : item.id >= 200 ? "weights" : "balloons";
            const imageUrl = `/${imageFolder}/${imageName}`;

            return (
              <li key={item.id} className="cart-item">
                <img src={imageUrl} alt={item.name} className="cart-thumbnail" />
                <span>{item.name} - ${item.price * item.quantity}</span>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={(event) => addToCart(item, event)}>+</button>
                  <button onClick={() => removeFromCart(item.id)}><Trash size={14} /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <h3>Total: ${totalCost.toFixed(2)}</h3>
      <button onClick={saveBouquet}>
        {mode === "website" ? "Add to Cart" : "Save My Bouquet"}
      </button>
    </div>
  );
}

function BalloonBar() {
  const [cart, setCart] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [step, setStep] = useState("latex");
  const [foilFilter, setFoilFilter] = useState("All");
  const [mode, setMode] = useState("store");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const detectedMode = params.get("mode") || "store";
      setMode(detectedMode);
    }
  }, []);

  const addToCart = (balloon, event) => {
    if (event) event.stopPropagation();
    setCart((prev) => {
      return prev.map((item) =>
        item.id === balloon.id ? { ...item, quantity: item.quantity + 1 } : item
      ).concat(prev.some((item) => item.id === balloon.id) ? [] : { ...balloon, quantity: 1 });
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const saveBouquet = async () => {
    const hasWeight = cart.some(item => item.id >= 200);
    if (!hasWeight) {
      alert("Please select a balloon weight before saving your bouquet.");
      return;
    }

    if (mode === "website") {
      for (const item of cart) {
        if (!item.variantId) {
          alert(`Missing variant ID for: ${item.name}`);
          return;
        }
      }

      const items = cart.map(item => ({
        id: item.variantId,
        quantity: item.quantity,
        properties: {
          Name: item.name
        }
      }));

      const customBalloons = cart.map(item => `${item.name} x${item.quantity}`).join(", ");
      const totalBalloons = cart.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = totalCost.toFixed(2);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.cutieballoons.com/cart/add";

      items.forEach((item, index) => {
        form.innerHTML += `
          <input type="hidden" name="items[${index}][id]" value="${item.id}" />
          <input type="hidden" name="items[${index}][quantity]" value="${item.quantity}" />
          <input type="hidden" name="items[${index}][properties][Name]" value="${item.properties.Name}" />
        `;
      });

      if (window.top !== window.self) {
        const redirectUrl = new URL("https://www.cutieballoons.com/pages/balloon-bar-cart-add");
        redirectUrl.searchParams.set("custom", customBalloons);
        redirectUrl.searchParams.set("count", totalBalloons.toString());
        redirectUrl.searchParams.set("price", `$${totalPrice}`);

        window.top.location.href = redirectUrl.toString();
        return;
      }

      document.body.appendChild(form);
      form.submit();
    } else {
      setOrderName(`CB-${Date.now()}`);
      setShowConfirmation(true);
    }
  };

  return (
    <div className="container">
      {mode && (
        <div style={{
          position: "fixed",
          top: 10,
          right: 10,
          background: "hotpink",
          color: "white",
          padding: "6px 12px",
          borderRadius: "6px",
          fontWeight: "bold",
          zIndex: 9999
        }}>
          MODE: {mode.toUpperCase()}
        </div>
      )}
      {/* UI rendering for steps, products, and CartSection goes here */}
    </div>
  );
}

export default function Page() {
  return <BalloonBar />;
}
