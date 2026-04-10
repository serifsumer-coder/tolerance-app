import { useState, useEffect } from "react";

export default function App() {
  const [partQty, setPartQty] = useState(1);

  const [holes, setHoles] = useState([
    { diameter: "", depth: "", qty: 1, quality: "balanced" }
  ]);

  const [supplier, setSupplier] = useState("B");
  const [discount, setDiscount] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const [result, setResult] = useState("");

  const supplierRates = {
    A: { rate: 55, label: "🟢 A Tier (Premium)" },
    B: { rate: 45, label: "🟡 B Tier (Balanced)" },
    C: { rate: 35, label: "🔴 C Tier (Cost)" }
  };

  const qualityData = {
    high: {
      label: "🟢 High (Slow-Precise)",
      peck: 10,
      peckTime: 32,
      setup: 18
    },
    balanced: {
      label: "🟡 Balanced",
      peck: 15,
      peckTime: 16,
      setup: 18
    },
    cost: {
      label: "🔴 Cost (Fast)",
      peck: 20,
      peckTime: 10.5,
      setup: 18
    }
  };

  const getSuggestion = (qty) => {
    if (qty >= 200) return "Full Serial → 20–35%";
    if (qty >= 50) return "Mid Serial → 10–20%";
    if (qty >= 10) return "Mini Serial → 5–10%";
    return "Low Volume → No discount expected";
  };

  useEffect(() => {
    setSuggestion(getSuggestion(partQty));
  }, [partQty]);

  const addHole = () => {
    setHoles([
      ...holes,
      { diameter: "", depth: "", qty: 1, quality: "balanced" }
    ]);
  };

  const updateHole = (i, field, value) => {
    const newHoles = [...holes];
    newHoles[i][field] = value;
    setHoles(newHoles);
  };

  // ✅ FIXED TIME CALC (SAAT DÖNER)
  const calcHoleTime = (h) => {
    if (!h.depth || !h.qty) return 0;

    const q = qualityData[h.quality];

    const peckCount = Math.ceil(h.depth / q.peck);

    const timePerHoleSec =
      peckCount * q.peckTime + q.setup;

    const totalSec = timePerHoleSec * h.qty;

    return (totalSec / 3600) * 1.15; // saat
  };

  const handleCalculate = () => {
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
MANUFACTURING SUMMARY
==============================

Workpieces: ${partQty}

Supplier:
${s.label}
Rate: €${s.rate}/hr

Production:
${suggestion}

------------------------------

Total Time:
${totalHours.toFixed(2)} h

Base Machining Cost:
€${machiningCost.toLocaleString()}

Discount:
-${d}%

------------------------------

Cost per Piece:
€${perPiece.toFixed(2)}

GRAND TOTAL:
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
            value={h.diameter}
            onChange={(e) => updateHole(i, "diameter", e.target.value)}
          />

          <input
            placeholder="Depth (mm)"
            value={h.depth}
            onChange={(e) => updateHole(i, "depth", e.target.value)}
          />

          <input
            type="number"
            value={h.qty}
            onChange={(e) => updateHole(i, "qty", Number(e.target.value))}
          />

          {/* 🔥 HER HOLE İÇİN QUALITY */}
          <select
            value={h.quality}
            onChange={(e) => updateHole(i, "quality", e.target.value)}
          >
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="cost">Cost</option>
          </select>
        </div>
      ))}

      <button onClick={addHole}>+ Add Hole</button>

      <h3>Supplier Selection</h3>
      <select
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      >
        <option value="A">A Tier</option>
        <option value="B">B Tier</option>
        <option value="C">C Tier</option>
      </select>

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