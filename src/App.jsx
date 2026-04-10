import { useState, useEffect } from "react";

export default function App() {
  const [partQty, setPartQty] = useState(1);

  const [slots, setSlots] = useState([
    { length: "", width: "", depth: "", qty: 1 }
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
    high: { peck: 10, peckTime: 32, setup: 18 },
    balanced: { peck: 15, peckTime: 16, setup: 18 },
    cost: { peck: 20, peckTime: 10.5, setup: 18 }
  };

  const feedRates = {
    balanced: 3000
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

  // SLOT
  const calcSlotTime = (s) => {
    if (!s.length || !s.width || !s.depth) return 0;

    const volume = s.length * s.width * s.depth;
    const minutes = volume / feedRates.balanced / 100;

    return (minutes / 60) * s.qty;
  };

  // HOLE
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
TOTAL TIME: ${totalHours.toFixed(2)} h
COST: €${finalCost.toLocaleString()}
`);
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Machining Estimator</h1>

      {/* WORKPIECE */}
      <h3>Workpiece Quantity</h3>
      <input type="number" value={partQty} onChange={e => setPartQty(Number(e.target.value))} />

      {/* SLOTS */}
      <h2>Slot Operations</h2>
      {slots.map((s, i) => (
        <div key={i}>
          <input placeholder="Length (mm)" onChange={e => {
            const arr = [...slots]; arr[i].length = e.target.value; setSlots(arr);
          }} />
          <input placeholder="Width (mm)" onChange={e => {
            const arr = [...slots]; arr[i].width = e.target.value; setSlots(arr);
          }} />
          <input placeholder="Depth (mm)" onChange={e => {
            const arr = [...slots]; arr[i].depth = e.target.value; setSlots(arr);
          }} />
          <input placeholder="Qty" type="number" onChange={e => {
            const arr = [...slots]; arr[i].qty = Number(e.target.value); setSlots(arr);
          }} />
        </div>
      ))}

      {/* HOLES */}
      <h2>Hole Operations</h2>
      {holes.map((h, i) => (
        <div key={i}>
          <input placeholder="Diameter (mm)" onChange={e => {
            const arr = [...holes]; arr[i].diameter = e.target.value; setHoles(arr);
          }} />
          <input placeholder="Depth (mm)" onChange={e => {
            const arr = [...holes]; arr[i].depth = e.target.value; setHoles(arr);
          }} />
          <input placeholder="Qty" type="number" onChange={e => {
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

      {/* SUPPLIER */}
      <h3>Supplier</h3>
      <select value={supplier} onChange={e => setSupplier(e.target.value)}>
        <option value="A">A Tier</option>
        <option value="B">B Tier</option>
        <option value="C">C Tier</option>
      </select>
      <div>{supplierRates[supplier].desc}</div>

      {/* DISCOUNT */}
      <h3>Discount</h3>
      <input placeholder={suggestion} value={discount} onChange={e => setDiscount(e.target.value)} />

      <br /><br />
      <button onClick={handleCalculate}>Calculate</button>

      <pre>{result}</pre>
    </div>
  );
}