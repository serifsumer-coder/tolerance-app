import { useState, useEffect } from "react";

export default function App() {
  const [partQty, setPartQty] = useState(1);

  const [holes, setHoles] = useState([
    { diameter: "", depth: "", qty: 1 }
  ]);

  const [quality, setQuality] = useState("balanced");
  const [supplier, setSupplier] = useState("B");
  const [discount, setDiscount] = useState("");

  const [suggestion, setSuggestion] = useState("");
  const [result, setResult] = useState("");

  // 🔧 QUALITY DATA (senin verdiğin model)
  const qualityData = {
    high: {
      label: "🟢 H7 Tolerance (Slow-Precise)",
      peck: 10,
      peckTime: 32,
      setup: 18,
      rz: "1.5"
    },
    balanced: {
      label: "🟡 H8 Tolerance (Optimal)",
      peck: 15,
      peckTime: 16,
      setup: 18,
      rz: "6"
    },
    cost: {
      label: "🔴 H10 Tolerance (Fast)",
      peck: 20,
      peckTime: 10.5,
      setup: 18,
      rz: "20"
    }
  };

  const supplierRates = {
    A: { rate: 55, label: "🟢 A Tier (Premium)" },
    B: { rate: 45, label: "🟡 B Tier (Balanced)" },
    C: { rate: 35, label: "🔴 C Tier (Cost)" }
  };

  const getSuggestion = (qty) => {
    if (qty >= 200) return "Full Serial Production → 20–35%";
    if (qty >= 50) return "Mid Serial Production → 10–20%";
    if (qty >= 10) return "Mini Serial Production → 5–10%";
    return "Low Volume";
  };

  useEffect(() => {
    setSuggestion(getSuggestion(partQty));
  }, [partQty]);

  const addHole = () => {
    setHoles([...holes, { diameter: "", depth: "", qty: 1 }]);
  };

  const updateHole = (i, field, value) => {
    const newHoles = [...holes];
    newHoles[i][field] = value;
    setHoles(newHoles);
  };

  // 🔥 YENİ DOĞRU FORMÜL
  const calcHoleTime = (h) => {
    if (!h.depth || !h.qty) return 0;

    const q = qualityData[quality];

    const peckCount = Math.ceil(h.depth / q.peck);

    const timePerHoleSec =
      peckCount * q.peckTime + q.setup;

    const totalSec = timePerHoleSec * h.qty;

    return (totalSec / 60) * 1.15; // %15 ek
  };

  const handleCalculate = () => {
    const q = qualityData[quality];
    const s = supplierRates[supplier];

    let totalHours = 0;

    holes.forEach(h => {
      totalHours += calcHoleTime(h);
    });

    totalHours *= partQty;

    const machiningCost = totalHours * s.rate;

    const d = Number(discount) || 0;
    const finalCost = machiningCost * (1 - d / 100);

    const perPiece = finalCost / partQty;

    setResult(`
==============================
🧾 MANUFACTURING SUMMARY
==============================

📦 Workpieces: ${partQty}

🎯 Quality:
${q.label}
Rz ≈ ${q.rz} μm

🏭 Supplier:
${s.label}
Rate: €${s.rate}/hr

📊 Production:
${suggestion}

------------------------------

⏱ Total Time:
${totalHours.toFixed(2)} h

💰 Base Machining Cost:
€${machiningCost.toLocaleString()}

📉 Discount:
-${d}%

------------------------------

💵 Cost per Piece:
€${perPiece.toFixed(2)}

🏁 GRAND TOTAL:
€${finalCost.toLocaleString()}

==============================
`);
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Hole Engine</h1>

      <h3>Workpiece Quantity</h3>
      <input
        type="number"
        value={partQty}
        onChange={(e) => setPartQty(Number(e.target.value))}
      />

      <h3>Hole Operations</h3>

      {holes.map((h, i) => (
        <div key={i} style={{ marginBottom: 15 }}>
          <input
            placeholder="Diameter (mm)"
            onChange={(e) => updateHole(i, "diameter", e.target.value)}
          />
          <input
            placeholder="Depth (mm)"
            onChange={(e) => updateHole(i, "depth", e.target.value)}
          />
          <input
            type="number"
            value={h.qty}
            onChange={(e) => updateHole(i, "qty", Number(e.target.value))}
          />
        </div>
      ))}

      <button onClick={addHole}>+ Add Hole</button>

      <h3>Quality Selection</h3>
      <select onChange={(e) => setQuality(e.target.value)}>
        <option value="high">High</option>
        <option value="balanced">Balanced</option>
        <option value="cost">Cost</option>
      </select>
      <div>{qualityData[quality].label}</div>

      <h3>Supplier Selection</h3>
      <select onChange={(e) => setSupplier(e.target.value)}>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <div>{supplierRates[supplier].label}</div>

      <h3>Discount (%)</h3>
      <input
        type="number"
        placeholder={suggestion}
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCalculate}>Calculate</button>

      <div style={{ whiteSpace: "pre-line", marginTop: 20 }}>
        {result}
      </div>
    </div>
  );
}