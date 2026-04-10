import { useState, useEffect } from "react";

export default function App() {
  const [partQty, setPartQty] = useState("");

  const [slots, setSlots] = useState([
    { length: "", width: "", depth: "", qty: 1, quality: "balanced" }
  ]);

  const [holes, setHoles] = useState([
    { diameter: "", depth: "", qty: 1, quality: "balanced" }
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
    high: {
      label: "High Quality (Slow / Precise)",
      feed: 2000,
      peck: 10,
      peckTime: 32
    },
    balanced: {
      label: "Balanced (Optimal)",
      feed: 3000,
      peck: 15,
      peckTime: 16
    },
    cost: {
      label: "Cost (Fast)",
      feed: 4500,
      peck: 20,
      peckTime: 10.5
    }
  };

  const getSuggestion = (qty) => {
    if (qty >= 200) return "Full Serial → 20–35%";
    if (qty >= 50) return "Mid Serial → 10–20%";
    if (qty >= 10) return "Mini Serial → 5–10%";
    return "Low Volume → No discount expected";
  };

  useEffect(() => {
    setSuggestion(getSuggestion(Number(partQty) || 0));
  }, [partQty]);

  // SLOT
  const calcSlot = (s) => {
    if (!s.length || !s.width || !s.depth) return 0;

    const volume = s.length * s.width * s.depth;
    const feed = qualityData[s.quality].feed;

    const minutes = volume / feed / 100;
    return (minutes / 60) * s.qty;
  };

  // HOLE
  const calcHole = (h) => {
    if (!h.depth || !h.qty) return 0;

    const q = qualityData[h.quality];

    const peckCount = Math.ceil(h.depth / q.peck);
    const sec = (peckCount * q.peckTime + 18) * h.qty;

    return (sec / 3600) * 1.15;
  };

  const handleCalculate = () => {
    const qty = Number(partQty) || 1;

    let slotTime = 0;
    let holeTime = 0;

    slots.forEach(s => slotTime += calcSlot(s));
    holes.forEach(h => holeTime += calcHole(h));

    const totalTime = (slotTime + holeTime) * qty;

    const rate = supplierRates[supplier].rate;
    const baseCost = totalTime * rate;

    const d = Number(discount) || 0;
    const finalCost = baseCost * (1 - d / 100);

    setResult(`
========= SUMMARY =========

Workpieces: ${qty}

Slot Time: ${slotTime.toFixed(2)} h
Hole Time: ${holeTime.toFixed(2)} h

TOTAL TIME: ${totalTime.toFixed(2)} h

Base Cost: €${baseCost.toLocaleString()}
Discount: -${d}%

FINAL: €${finalCost.toLocaleString()}
`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Machining Estimator</h1>

      <h3>Workpiece Quantity</h3>
      <input
        value={partQty}
        placeholder="Enter quantity"
        onChange={(e) => setPartQty(e.target.value)}
      />

      <h2>Slot Operations</h2>
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
          <input type="number" value={s.qty} onChange={e => {
            const arr = [...slots]; arr[i].qty = e.target.value; setSlots(arr);
          }} />
          <select value={s.quality} onChange={e => {
            const arr = [...slots]; arr[i].quality = e.target.value; setSlots(arr);
          }}>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="cost">Cost</option>
          </select>
          <div>{qualityData[s.quality].label}</div>
        </div>
      ))}

      <button onClick={() => setSlots([...slots, { length: "", width: "", depth: "", qty: 1, quality: "balanced" }])}>
        + Add Slot
      </button>

      <h2>Hole Operations</h2>
      {holes.map((h, i) => (
        <div key={i}>
          <input placeholder="Diameter" onChange={e => {
            const arr = [...holes]; arr[i].diameter = e.target.value; setHoles(arr);
          }} />
          <input placeholder="Depth" onChange={e => {
            const arr = [...holes]; arr[i].depth = e.target.value; setHoles(arr);
          }} />
          <input type="number" value={h.qty} onChange={e => {
            const arr = [...holes]; arr[i].qty = e.target.value; setHoles(arr);
          }} />
          <select value={h.quality} onChange={e => {
            const arr = [...holes]; arr[i].quality = e.target.value; setHoles(arr);
          }}>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="cost">Cost</option>
          </select>
          <div>{qualityData[h.quality].label}</div>
        </div>
      ))}

      <button onClick={() => setHoles([...holes, { diameter: "", depth: "", qty: 1, quality: "balanced" }])}>
        + Add Hole
      </button>

      <h3>Supplier</h3>
      <select value={supplier} onChange={e => setSupplier(e.target.value)}>
        <option value="A">A Tier</option>
        <option value="B">B Tier</option>
        <option value="C">C Tier</option>
      </select>
      <div>{supplierRates[supplier].desc}</div>

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