"use client";
import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import "./styles.css";

import { useSearchParams } from "next/navigation";


const latexBalloons = [
  { id: 1, name: "Diamond Clear", price: 3.25 },
  { id: 2, name: "White", price: 3.25 },
  { id: 3, name: "Pearl White", price: 3.25 },
  { id: 4, name: "Gray", price: 3.25 },
  { id: 5, name: "Pastel Yellow", price: 3.25 },
  { id: 6, name: "Yellow", price: 3.25 },
  { id: 7, name: "Goldenrod", price: 3.25 },
  { id: 8, name: "Metallic Gold", price: 3.25 },
  { id: 9, name: "Blush", price: 3.25 },
  { id: 10, name: "White Sand", price: 3.25 },
  { id: 11, name: "Cream", price: 3.25 },
  { id: 12, name: "Chrome Champagne", price: 3.25 },
  { id: 13, name: "Mocha Brown", price: 3.25 },
  { id: 14, name: "Chocolate Brown", price: 3.25 },
  { id: 15, name: "Rosewood", price: 3.25 },
  { id: 16, name: "Pearl Peach", price: 3.25 },
  { id: 17, name: "Rose Gold", price: 3.25 },
  { id: 18, name: "Melon", price: 3.25 },
  { id: 19, name: "Coral", price: 3.25 },
  { id: 20, name: "Orange", price: 3.25 },
  { id: 21, name: "Pearl Pink", price: 3.25 },
  { id: 22, name: "Pink", price: 3.25 },
  { id: 23, name: "Rose", price: 3.25 },
  { id: 24, name: "Wild Berry", price: 3.25 },
  { id: 25, name: "Fuchsia", price: 3.25 },
  { id: 26, name: "Chrome Fuchsia", price: 3.25 },
  { id: 27, name: "Pearl Burgundy", price: 3.25 },
  { id: 28, name: "Chrome Red", price: 3.25 },
  { id: 29, name: "Red", price: 3.25 },
  { id: 30, name: "Pastel Lilac", price: 3.25 },
  { id: 31, name: "Pearl Lavender", price: 3.25 },
  { id: 32, name: "Spring Lilac", price: 3.25 },
  { id: 33, name: "Purple", price: 3.25 },
  { id: 34, name: "Pastel Blue", price: 3.25 },
  { id: 35, name: "Pale Blue", price: 3.25 },
  { id: 36, name: "Caribbean Blue", price: 3.25 },
  { id: 37, name: "Tropical Teal", price: 3.25 },
  { id: 38, name: "Dark Blue", price: 3.25 },
  { id: 39, name: "Midnight Blue", price: 3.25 },
  { id: 40, name: "Eucalyptus", price: 3.25 },
  { id: 41, name: "Pastel Green", price: 3.25 },
  { id: 42, name: "Wintergreen", price: 3.25 },
  { id: 43, name: "Lime Green", price: 3.25 },
  { id: 44, name: "Spring Green", price: 3.25 },
  { id: 45, name: "Green", price: 3.25 },
  { id: 46, name: "Emerald Green", price: 3.25 },
  { id: 47, name: "Black", price: 3.25 },
  { id: 48, name: "Chrome Silver", price: 3.25 },
  { id: 49, name: "Chrome Gold", price: 3.25 },
  { id: 50, name: "Chrome Rose Gold", price: 3.25 },
  { id: 51, name: "Chrome Purple", price: 3.25 },
  { id: 52, name: "Chrome Blue", price: 3.25 }
];

const foilBalloons = [
  { id: 101, name: "Happy Birthday Star", price: 15, category: "Shapes" },
  { id: 102, name: "Number 1 Gold", price: 8.0, category: "Number Balloons" },
  { id: 103, name: "Number 2 Gold", price: 8.0, category: "Number Balloons" },
  { id: 104, name: "Congrats Balloon", price: 15, category: "Shapes" },
  { id: 105, name: "Dinosaur Shape", price: 9.0, category: "Shapes" },
  { id: 106, name: "Champagne Bottle", price: 10.0, category: "Shapes" },
  { id: 107, name: "Jumbo Water Colour Birthday", price: 28, category: "Birthday" },
  { id: 108, name: "Jumbo Bright Birthday", price: 28, category: "Birthday" },
  { id: 109, name: "Jumbo Turquoise Birthday", price: 28, category: "Birthday" },
  { id: 110, name: "Jumbo Rose Gold Birthday", price: 28, category: "Birthday" },
  { id: 111, name: "Jumbo Holographic Birthday", price: 28, category: "Birthday" },
  { id: 112, name: "Jumbo Skater Birthday", price: 28, category: "Birthday" },
  { id: 113, name: "18\" Rose Gold Ombre Birthday", price: 15, category: "Birthday" },
  { id: 114, name: "18\" Floral Heart Birthday", price: 15, category: "Birthday" },
  { id: 115, name: "18\" Pink Gold Dots Birthday", price: 15, category: "Birthday" },
  { id: 116, name: "18\" Daisies Birthday", price: 15, category: "Birthday" },
  { id: 117, name: "18\" Modern Navy Birthday", price: 15, category: "Birthday" },
  { id: 118, name: "18\" Make a Wish Birthday", price: 15, category: "Birthday" },
  { id: 119, name: "18\" Sparkle Holographic Birthday", price: 15, category: "Birthday" },
  { id: 120, name: "18\" Puppies Birthday", price: 15, category: "Birthday" }
];

const weights = [
  { id: 201, name: "Rose Gold Weight", price: 2.25 },
  { id: 202, name: "Gold Weight", price: 2.25 },
  { id: 203, name: "Silver Weight", price: 2.25 },
  { id: 204, name: "Black Weight", price: 2.25 }
];

const balloonImageClass = (balloon) => {
  return balloon.category ? "balloon-image foil" : "balloon-image latex";
};

function CartSection({ cart, addToCart, decreaseQty, removeFromCart, saveBouquet, totalCost, mode }) {
  return (
    <div className="cart sticky-cart">
      <h2>Your Custom Bouquet 🛒</h2>
      {cart.length === 0 ? (
        <p>No balloons selected.</p>
      ) : (
        <ul>
          {cart.map((item) => {
            const imageName = item.name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-") + ".jpg";
            const imageFolder = item.category
              ? "foils"
              : item.id >= 200
              ? "weights"
              : "balloons";
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

export default function BalloonBar() {
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

    useEffect(() => {
  console.log("Current window.location.href:", window.location.href);
  console.log("Detected MODE:", mode);
}, [mode]);


  const SHOPIFY_VARIANT_ID = 46855513047296;

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
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
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
    console.log("✅ WEBSITE mode detected - attempting add to cart");

    try {
      const topHref = window.top.location.href;
      if (!topHref.includes("cutieballoons.com")) {
        alert("Add to Cart only works on our main website — try it at cutieballoons.com!");
        return;
      }
    } catch (err) {
      console.warn("⚠️ Unable to access top.location.href due to cross-origin policy.");
      // Let it continue
    }

    const items = [{
      id: SHOPIFY_VARIANT_ID,
      quantity: 1,
      properties: {
        "Custom Balloons": cart.map(item => `${item.name} x${item.quantity}`).join(", "),
        "Total Balloons": cart.reduce((acc, item) => acc + item.quantity, 0),
        "Total Price": `$${totalCost.toFixed(2)}`
      }
    }];

    await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });

    window.location.href = "/cart";
    return;
  } else {
    // STORE mode logic
    const response = await fetch("/api/create-draft-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });

    const data = await response.json();
    if (data.name) {
      setOrderName(data.name);
      setShowConfirmation(true);
    }
  }
};


  const displayedFoils = foilFilter === "All" ? foilBalloons : foilBalloons.filter(b => b.category === foilFilter);
return (
  <div className="container">
    {/* Current Mode Display */}
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

      <img src="/cutie-logo.jpg" alt="Cutie Balloons Logo" className="logo" />
      <h1 className="title"></h1>
      <div className="step-buttons">
        <button className={step === "latex" ? "active" : ""} onClick={() => setStep("latex")}>Step 1: Latex Balloons</button>
        <button className={step === "foil" ? "active" : ""} onClick={() => setStep("foil")}>Step 2: Foil Balloons</button>
        <button className={step === "weight" ? "active" : ""} onClick={() => setStep("weight")}>Step 3: Choose Weight (Required)</button>
      </div>
      {showConfirmation ? (
        <div className="confirmation">
          <h2>🎉 Your bouquet is saved!</h2>
          <p><strong>Order ID:</strong> {orderName}</p>
          <p>Show this screen to a team member. They’ll pull up your custom bouquet in our system.</p>
          <div className="confirmation-buttons">
            <button onClick={() => {
              setCart([]);
              setOrderName("");
              setShowConfirmation(false);
            }}>
              Start New Session
            </button>
            <button onClick={() => setShowConfirmation(false)}>
              Edit This Bouquet
            </button>
          </div>
        </div>
      ) : (
        <>
{step === "latex" && (
  <div className="main-layout">
    <div className="balloon-grid">
      {latexBalloons.map((balloon) => {
        const imageName = balloon.name.toLowerCase().replace(/ /g, "-") + ".jpg";
        const imageUrl = `/balloons/${imageName}`;
        const cartItem = cart.find((item) => item.id === balloon.id);

        return (
          <div key={balloon.id} className="balloon-item">
            <img
              src={imageUrl}
              alt={balloon.name}
              className={balloonImageClass(balloon)}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h2>{balloon.name}</h2>
            <p>${balloon.price.toFixed(2)}</p>
            <button onClick={(event) => addToCart(balloon, event)}>Add</button>
            {cartItem && (
              <div className="quantity-controls">
                <button onClick={() => decreaseQty(balloon.id)}>-</button>
                <span>{cartItem.quantity}</span>
                <button onClick={(event) => addToCart(balloon, event)}>+</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
    <CartSection
  cart={cart}
  addToCart={addToCart}
  decreaseQty={decreaseQty}
  removeFromCart={removeFromCart}
  saveBouquet={saveBouquet}
  totalCost={totalCost}
  mode={mode}
/>
  </div>
)}

{step === "foil" && (
  <div className="main-layout">
    <div className="left-column">
      <div className="filters">
        <button onClick={() => setFoilFilter("All")} className={foilFilter === "All" ? "active" : ""}>All</button>
        <button onClick={() => setFoilFilter("Birthday")} className={foilFilter === "Birthday" ? "active" : ""}>Birthday</button>
        <button onClick={() => setFoilFilter("Number Balloons")} className={foilFilter === "Number Balloons" ? "active" : ""}>Number Balloons</button>
        <button onClick={() => setFoilFilter("Shapes")} className={foilFilter === "Shapes" ? "active" : ""}>Shapes</button>
      </div>

      <div className="balloon-grid">
        {displayedFoils.map((balloon) => {
          const imageName = balloon.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-") + ".jpg";
          const imageUrl = `/foils/${imageName}`;
          const cartItem = cart.find((item) => item.id === balloon.id);

          return (
            <div key={balloon.id} className="balloon-item">
              <img
                src={imageUrl}
                alt={balloon.name}
                className={balloonImageClass(balloon)}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <h2>{balloon.name}</h2>
              <p>${balloon.price.toFixed(2)}</p>
              <button onClick={(event) => addToCart(balloon, event)}>Add</button>
              {cartItem && (
                <div className="quantity-controls">
                  <button onClick={() => decreaseQty(balloon.id)}>-</button>
                  <span>{cartItem.quantity}</span>
                  <button onClick={(event) => addToCart(balloon, event)}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    <CartSection
      cart={cart}
      addToCart={addToCart}
      decreaseQty={decreaseQty}
      removeFromCart={removeFromCart}
      saveBouquet={saveBouquet}
      totalCost={totalCost}
      mode={mode}
    />
  </div>
)}


{step === "weight" && (
  <div className="main-layout">
    <div className="balloon-grid">
      {weights.map((weight) => {
        const imageName = weight.name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-") + ".jpg";
        const imageUrl = `/weights/${imageName}`;
        const cartItem = cart.find((item) => item.id === weight.id);

        return (
          <div key={weight.id} className="balloon-item">
            <img
              src={imageUrl}
              alt={weight.name}
              className="balloon-image"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h2>{weight.name}</h2>
            <p>${weight.price.toFixed(2)}</p>
            <button onClick={(event) => {
              event.stopPropagation();
              setCart((prev) => {
                const withoutWeights = prev.filter(item => item.id < 200);
                return [...withoutWeights, { ...weight, quantity: 1 }];
              });
            }}>
              Select
            </button>
            {cartItem && <p>✅ Selected</p>}
          </div>
        );
      })}
    </div>
    <CartSection
  cart={cart}
  addToCart={addToCart}
  decreaseQty={decreaseQty}
  removeFromCart={removeFromCart}
  saveBouquet={saveBouquet}
  totalCost={totalCost}
  mode={mode}
/>
  </div>
)}
        </>
      )}
    </div>
  );
}
