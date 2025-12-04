// src/App.jsx
import React, { useState, useEffect } from "react";

/* Products (same as before) */
const products = [
  { id: 1, categoryTitle: "Onesie", name: "Organic Cotton Bodysuit (Pink)", group: "Clothing", price: 19.99, rating: 4.8, isNew: true },
  { id: 2, categoryTitle: "Diapers", name: "Premium Diaper Pack (100ct)", group: "Essentials", price: 34.5, rating: 4.5, isNew: false },
  { id: 3, categoryTitle: "Walker", name: "Wooden Activity Walker", group: "Toys", price: 79.99, rating: 4.9, isNew: true },
  { id: 4, categoryTitle: "Feeding", name: "Silicone Feeding Set", group: "Feeding", price: 24.99, rating: 4.7, isNew: false },
  { id: 5, categoryTitle: "Swaddle", name: "Soft Muslin Swaddle", group: "Bedding", price: 14.99, rating: 4.6, isNew: true },
  { id: 6, categoryTitle: "Teether", name: "Gummy Teether Ring", group: "Essentials", price: 9.99, rating: 4.3, isNew: false },
  { id: 7, categoryTitle: "Bathtub", name: "Baby Bath Tub", group: "Bathing", price: 49.0, rating: 4.6, isNew: false },
  { id: 8, categoryTitle: "Car Seat", name: "Infant Car Seat", group: "Gear", price: 199.99, rating: 4.9, isNew: true },
  { id: 9, categoryTitle: "Blanket", name: "Cozy Baby Blanket", group: "Bedding", price: 22.0, rating: 4.4, isNew: false },
  { id: 10, categoryTitle: "Bottle", name: "Anti-colic Glass Bottle 250ml", group: "Feeding", price: 15.5, rating: 4.5, isNew: false },
];

const colorMap = {
  Onesie: "#FDE8E8",
  Diapers: "#DDEFF6",
  Walker: "#FBF3C9",
  Feeding: "#DFFFE6",
  Swaddle: "#FEE1E8",
  Teether: "#F2CAC6",
  Bathtub: "#DCEFF9",
  "Car Seat": "#D7E1F5",
  Blanket: "#FFF0E6",
  Bottle: "#F2F8F4",
};

function formatPrice(n) {
  return `$${n.toFixed(2)}`;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  // PWA install banner state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Catch beforeinstallprompt to show our custom install UI
    function onBeforeInstallPrompt(e) {
      e.preventDefault(); // Prevent the automatic prompt
      setDeferredPrompt(e);
      setShowInstall(true);
      console.log("beforeinstallprompt fired — saved event");
    }

    // Listen for native install event to hide banner when installed
    function onAppInstalled() {
      setInstalled(true);
      setShowInstall(false);
      setDeferredPrompt(null);
      setToast("App installed ✅");
      setTimeout(() => setToast(null), 3000);
      console.log("PWA installed");
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  // Install button handler — prompts the native install UI
  async function handleInstallClick() {
    if (!deferredPrompt) {
      // no saved prompt (browser may not allow) — optionally show instructions
      setToast("Install not available — try from browser menu (⋮) → Install App");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    deferredPrompt.prompt();
    // Wait for user choice
    const choice = await deferredPrompt.userChoice;
    console.log("userChoice:", choice);
    if (choice.outcome === "accepted") {
      setToast("Thanks! Installation started.");
    } else {
      setToast("Installation dismissed.");
    }
    setShowInstall(false);
    setDeferredPrompt(null);
    setTimeout(() => setToast(null), 2200);
  }

  function addToCart(p) {
    setCart((c) => [...c, p]);
    setToast(`${p.name} added to cart`);
    setTimeout(() => setToast(null), 2000);
  }

  async function sendDemoNotification() {
    try {
      if (!("Notification" in window)) {
        alert("This browser does not support notifications.");
        return;
      }
      let permission = Notification.permission;
      if (permission === "default") permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notification permission not granted or blocked. Please allow from site settings.");
        return;
      }
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) reg = await navigator.serviceWorker.register("/service-worker.js");
      if (reg && reg.showNotification) {
        await reg.showNotification("BabyBliss — Demo", {
          body: "Thanks for trying push notifications! Tap to open BabyBliss.",
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          vibrate: [100, 50, 100],
          data: { url: "/" },
        });
        console.log("shown via SW");
      } else {
        new Notification("BabyBliss — Demo", {
          body: "Thanks for trying push notifications! (fallback)",
          icon: "/icons/icon-192.png",
        });
        console.log("shown via fallback new Notification");
      }
    } catch (err) {
      console.error("sendDemoNotification error:", err);
      alert("Could not show notification. See console for details.");
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="logo">BabyBliss</span>
            <small className="tagline">Curated baby essentials</small>
          </div>
          <nav className="nav">
            <button className="btn icon" aria-label={`Cart with ${cart.length} items`}>
              🛒 <span className="cart-count">{cart.length}</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero hero-large">
          <div className="hero-copy">
            <h1>Featured Baby Products (Mock Data)</h1>
            <p className="lead">Beautiful, large category tiles — demo-only UI inspired by your screenshot.</p>
            <div className="cta-row">
              <button className="btn primary" onClick={() => window.scrollTo({ top: 1000, behavior: "smooth" })}>
                Shop Now
              </button>
              <button className="btn outline" onClick={sendDemoNotification}>
                Send Notification
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card small">
              <div className="visual-big">👶</div>
            </div>
          </div>
        </section>

        <section className="products">
          <div className="products-head">
            <h2>Featured Baby Products (Mock Data)</h2>
          </div>

          <div className="grid">
            {products.map((p) => {
              const bg = colorMap[p.categoryTitle] || "#F5F5F5";
              return (
                <article key={p.id} className="card" role="article" tabIndex="0">
                  <div className="card-media">
                    <div className="tile" style={{ background: bg }}>
                      {p.isNew && <div className="badge-top-left">NEW ARRIVAL</div>}
                      <div className="tile-title">{p.categoryTitle}</div>
                    </div>
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{p.name}</h3>
                    <div className="meta-row">
                      <div className="group">{p.group}</div>
                      <div className="price">{formatPrice(p.price)}</div>
                    </div>

                    <div className="card-footer">
                      <div className="rating">★ {p.rating.toFixed(1)} / 5</div>
                      <button className="btn small" onClick={() => addToCart(p)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} BabyBliss — Demo only</p>
      </footer>

      {/* Install Banner (bottom-left) */}
      {showInstall && !installed && (
        <div className="install-banner" role="dialog" aria-label="Install BabyBliss">
          <div className="install-content">
            <div className="install-left">
              <div className="install-title">Install BabyBliss</div>
              <div className="install-desc">Add BabyBliss to your device for a fast, app-like experience.</div>
            </div>
            <div className="install-actions">
              <button className="btn install" onClick={handleInstallClick}>
                Install
              </button>
              <button
                className="btn ghost small"
                onClick={() => {
                  setShowInstall(false);
                  setDeferredPrompt(null);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}