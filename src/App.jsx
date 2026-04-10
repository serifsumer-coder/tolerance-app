import { useState, useEffect } from "react";

export default function App() {
  const [partQty, setPartQty] = useState(1);

  // SLOT
  const [slots, setSlots] = useState([
    { length: "", width: "", depth: "", qty: 1 }
  ]);

  // HOLE
  const [holes, setHoles] = useState([
    { depth: "", qty: 1, quality: "balanced" }
  ]);

  const [supplier, setSupplier] = useState("B");
  const [discount, setDiscount] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [result, setResult] = useState("");

  const supplierRates = {
    A: { rate: 55, desc: "High-end EU supplier" },
    B: { rate: 45, desc: "Balanced industrial supplier" },
    C: { rate: 35, desc: "Low cost workshop" }
  };

  const qualityData = {
    high: { peck: 10, peckTime: 32, setup: 18 },
    balanced: { peck: 15, peckTime: 16, setup: 18 },
    cost: { peck: 20, peckTime: 10.5, setup: 18 }
  };

  const feedRates = {
    high: 2000,
    balanced: 3000,
    cost: 4500
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

  // SLOT TIME
  const calcSlotTime = (s) => {
    if (!s.length || !s.width || !s.depth) return 0;

    const volume = s.length * s.width * s.depth;
    const feed = feedRates["balanced"]; // basit tutuyoruz

    const minutes = volume / feed / 100;
    return (minutes / 60) * s.qty;
  };

  // HOLE TIME
  const calcHoleTime = (h) => {
    if (!h.depth || !h.qty) return 0;

    const q = qualityData[h.quality];

    const peckCount = Math.ceil(h.depth / q.peck);
    const timePerHoleSec = peckCount * q.peckTime + q.setup;
    const totalSec = timePerHoleSec * h.qty;

    return (totalSec / 3600) * 1.15;
  };

  const handleCalculate = () => {
    const rate = supplierRates[supplier].rate;

    let slotHours = 0;
    let holeHours = 0;

    slots.forEach(s => slotHours += calcSlotTime(s));
    holes.forEach(h => holeHours += calcHoleTime(h));

    const totalHours = (slotHours + holeHours) * partQty;

    const machiningCost = totalHours * rate;

    const d = Number(discount) || 0;
    const finalCost = machiningCost * (1 - d / 100);

    const perPiece = finalCost / partQty;

    setResult(`
========== SUMMARY ==========

Workpieces: ${partQty}

Supplier:
€${rate}/hr
${supplierRates[supplier].desc}

Production:
${suggestion}

----------------------------

Slot Time: ${slotHours.toFixed(2)} h
Hole Time: ${holeHours.toFixed(2)} h

TOTAL TIME:
${totalHours.toFixed(2)} h

Machining Cost:
€${machiningCost.toLocaleString()}

Discount: -${d}%

----------------------------

Cost per Piece:
€${perPiece.toFixed(2)}

GRAND TOTAL:
€${finalCost.toLocaleString()}
`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Machining Estimator</h1>

      <h3>Workpiece Qty</h3>
      <input type="number" value={partQty} onChange={e => setPartQty(Number(e.target.value))} />

      <h3>Slots</h3>
      {slots.map((s, i) => (
        <div key={i}>
          <input placeholder="Length" onChange={e => {
            const arr = [...slots]; arr[i].length = e.target.value; setSlots(arr);
          }} />
          <input placeholder="Width" onChange={e => {
            const arr = [...slots]; arr[i].width = e.target.value; setSlots(arr);
          }} />
          <input placeholder="Depth" onChange={e => {
            const arr = [...slots]; arr[i].depth = e.target.value; setSlots(arr);
          }} />
        </div>
      ))}

      <h3>Holes</h3>
      {holes.map((h, i) => (
        <div key={i}>
          <input placeholder="Depth" onChange={e => {
            const arr = [...holes]; arr[i].depth = e.target.value; setHoles(arr);
          }} />
          <input type="number" value={h.qty} onChange={e => {
            const arr = [...holes]; arr[i].qty = Number(e.target.value); setHoles(arr);
          }} />
          <select value={h.quality} onChange={e => {
            const arr = [...holes]; arr[i].quality = e.target.value; setHoles(arr);
          }}>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="cost">Cost</option>
          </select>
        </div>
      ))}

      <h3>Supplier</h3>
      <select value={supplier} onChange={e => setSupplier(e.target.value)}>
        <option value="A">A Tier</option>
        <option value="B">B Tier</option>
        <option value="C">C Tier</option>
      </select>

      {/* 🔥 DESCRIPTION SABİT */}
      <div style={{ marginTop: 5 }}>
        {supplierRates[supplier].desc}
      </div>

      <h3>Discount</h3>
      <input
        placeholder={suggestion}
        value={discount}
        onChange={e => setDiscount(e.target.value)}
      />

      <br /><br />
      <button onClick={handleCalculate}>Calculate</button>

      <pre>{result}</pre>
    </div>
  );
}