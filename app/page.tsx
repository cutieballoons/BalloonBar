"use client";
import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import "./styles.css";

import { useSearchParams } from "next/navigation";

const latexBalloons = [
  { id: 1, name: "Crystal Clear", price: 3.25, variantId: 46856153039104 },
  { id: 2, name: "White", price: 3.25, variantId: 46855513047296 },
  // ... (all other latex balloons)
  { id: 52, name: "Chrome Blue", price: 3.25, variantId: 46855513047296 }
];

const foilBalloons = [
  { id: 101, name: "Happy Birthday Star", price: 15, category: "Shapes" },
  // ... (all other foil balloons)
  { id: 120, name: "18\" Puppies Birthday", price: 15, category: "Birthday" }
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
  if (mode === "website") {
    console.log("🚨 Hardcoded test mode start");

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.cutieballoons.com/cart/add";

    // ✅ Hardcoded known-good item with a verified variantId
    form.innerHTML += `
      <input type="hidden" name="items[0][id]" value="46856153039104" />
      <input type="hidden" name="items[0][quantity]" value="2" />
      <input type="hidden" name="items[0][properties][Name]" value="Crystal Clear" />
    `;

    document.body.appendChild(form);
    form.submit();
    return;
  }

  // Store mode logic (unchanged)
  setOrderName(`CB-${Date.now()}`);
  setShowConfirmation(true);
};

  const displayedFoils = foilFilter === "All" ? foilBalloons : foilBalloons.filter(b => b.category === foilFilter);

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

      <img src="/cutie-logo.jpg" alt="Cutie Balloons Logo" className="logo" />
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
                    const imageName = balloon.name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-") + ".jpg";
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

export default function Page() {
  return <BalloonBar />;
}
