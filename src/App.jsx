import { useState } from "react";

export default function App() {
  const [nominal, setNominal] = useState("");
  const [tol, setTol] = useState("");
  const [actual, setActual] = useState("");
  const [tolResult, setTolResult] = useState("");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [quality, setQuality] = useState("balanced");
  const [supplier, setSupplier] = useState("B");
  const [machResult, setMachResult] = useState("");

  const qualitySettings = {
    high: {
      feed: 2000,
      rpm: 8000,
      label: "🟢 Premium Finish",
      desc: "Best surface quality (Rz ~3 μm), slower but precise"
    },
    balanced: {
      feed: 3000,
      rpm: 7000,
      label: "🟡 Balanced",
      desc: "Good surface (Rz ~10 μm), optimal price-performance"
    },
    cost: {
      feed: 4500,
      rpm: 5500,
      label: "🔴 Cost Optimized",
      desc: "Rough finish (Rz ~25 μm), fastest and cheapest option"
    }
  };

  const supplierRates = {
    A: {
      rate: 55,
      label: "🟢 A Tier (Premium Supplier)",
      desc: "High reliability, advanced machines, Western Europe pricing"
    },
    B: {
      rate: 45,
      label: "🟡 B Tier (Balanced Supplier)",
      desc: "Best price-performance, standard industrial capability"
    },
    C: {
      rate: 35,
      label: "🔴 C Tier (Cost Supplier)",
      desc: "Low cost, small workshops, higher uncertainty"
    }
  };

  const handleTolerance = () => {
    const n = Number(nominal);
    const t = Number(tol);
    const a = Number(actual);

    if (!n || !t || !a) {
      setTolResult("❗ Fill all fields");
      return;
    }

    const min = n - t;
    const max = n + t;

    if (a >= min && a <= max) {
      if (t < n * 0.01) {
        setTolResult("⚠️ Within tolerance but very tight → high cost risk");
      } else {
        setTolResult("✅ Within tolerance → OK");
      }
    } else {
      setTolResult("❌ Out of tolerance → reject or rework needed");
    }
  };

  const handleMachining = () => {
    const L = Number(length);
    const W = Number(width);
    const D = Number(depth);

    if (!L || !W || !D) {
      setMachResult("❗ Fill all fields");
      return;
    }

    const { feed, label } = qualitySettings[quality];
    const { rate, label: supplierLabel } = supplierRates[supplier];

    const minutes = (L * W * D) / feed / 100;
    const hours = minutes / 60;

    const cost = hours * rate;

    const low = cost * 0.9;
    const high = cost * 1.2;

    setMachResult(
`${label}
${supplierLabel}

⏱ Time: ${hours.toFixed(2)} h
💶 Estimated Cost: €${cost.toFixed(0)}

📊 Expected Range:
€${low.toFixed(0)} – €${high.toFixed(0)}

💡 Tip:
Suppliers may quote around this range depending on complexity`
    );
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Manufacturing Decision Tool</h1>

      <h2>Tolerance Check</h2>

      <input placeholder="Nominal" value={nominal} onChange={e => setNominal(e.target.value)} /><br /><br />
      <input placeholder="Tolerance" value={tol} onChange={e => setTol(e.target.value)} /><br /><br />
      <input placeholder="Actual" value={actual} onChange={e => setActual(e.target.value)} /><br /><br />

      <button onClick={handleTolerance}>Check</button>

      <div style={{ margin: "20px" }}>{tolResult}</div>

      <hr />

      <h2>Machining + Pricing</h2>

      <input placeholder="Length" value={length} onChange={e => setLength(e.target.value)} /><br /><br />
      <input placeholder="Width" value={width} onChange={e => setWidth(e.target.value)} /><br /><br />
      <input placeholder="Depth" value={depth} onChange={e => setDepth(e.target.value)} /><br /><br />

      {/* 🔥 QUALITY TITLE */}
      <div style={{ marginTop: "20px", fontWeight: "bold" }}>
        Machining Quality Selection
      </div>

      <select value={quality} onChange={e => setQuality(e.target.value)}>
        <option value="high">Premium</option>
        <option value="balanced">Balanced</option>
        <option value="cost">Cost</option>
      </select>

      <div style={{ marginTop: "8px", fontSize: "14px", opacity: 0.8 }}>
        {qualitySettings[quality].desc}
      </div>

      <br /><br />

      {/* 🔥 SUPPLIER TITLE */}
      <div style={{ marginTop: "20px", fontWeight: "bold" }}>
        Supplier Type Selection
      </div>

      <select value={supplier} onChange={e => setSupplier(e.target.value)}>
        <option value="A">A Tier</option>
        <option value="B">B Tier</option>
        <option value="C">C Tier</option>
      </select>

      <div style={{ marginTop: "8px", fontSize: "14px", opacity: 0.8 }}>
        {supplierRates[supplier].desc}
      </div>

      <br /><br />

      <button onClick={handleMachining}>Calculate</button>

      <div style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
        {machResult}
      </div>
    </div>
  );
}