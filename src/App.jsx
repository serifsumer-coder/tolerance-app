import { useState, useEffect } from "react";

export default function App() {
  const [partQty, setPartQty] = useState("");

  const [slot, setSlot] = useState({
    length: "",
    width: "",
    depth: "",
    qty: 1,
    quality: "balanced"
  });

  const [hole, setHole] = useState({
    diameter: "",
    depth: "",
    qty: 1,
    quality: "balanced"
  });

  const [supplier, setSupplier] = useState("B");
  const [discount, setDiscount] = useState("");

  const [result, setResult] = useState("");

  // 🔧 QUALITY (slot + hole ortak)
  const qualityData = {
    high: { label: "High", feed: 2000, peck: 10, peckTime: 32 },
    balanced: { label: "Balanced", feed: 3000, peck: 15, peckTime: 16 },
    cost: { label: "Cost", feed: 4500, peck: 20, peckTime: 10.5 }
  };

  const supplierRates = {
    A: { rate: 55, desc: "High-end EU supplier" },
    B: { rate: 45, desc: "Balanced industrial supplier" },
    C: { rate: 35, desc: "Low cost workshop" }
  };

  // 🔩 SLOT TIME (basit ama stabil)
  const calcSlot = () => {
    if (!slot.length || !slot.width || !slot.depth) return 0;

    const volume = slot.length * slot.width * slot.depth;
    const feed = qualityData[slot.quality].feed;

    const minutes = volume / feed / 100;
    return (minutes / 60) * slot.qty;
  };

  // 🔩 HOLE TIME (DOĞRU)
  const calcHole = () => {
    if (!hole.depth) return 0;

    const q = qualityData[hole.quality];

    const peckCount = Math.ceil(hole.depth / q.peck);
    const sec = peckCount * q.peckTime * hole.qty;

    return (sec / 3600) * 1.15;
  };

  const handleCalculate = () => {
    const qty = Number(partQty) || 1;

    const slotTime = calcSlot();
    const holeTime = calcHole();

    const total = (slotTime + holeTime) * qty;

    const rate = supplierRates[supplier].rate;
    const cost = total * rate;

    const d = Number(discount) || 0;
    const final = cost * (1 - d / 100);

    setResult(`
Total Time: ${total.toFixed(2)} h
Total Cost: €${final.toLocaleString()}
`);
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Machining Estimator</h1>

      {/* WORKPIECE */}
      <h3>Workpiece Quantity</h3>
      <input
        type="number"
        value={partQty}
        placeholder="Enter qty"
        onChange={(e) => setPartQty(e.target.value)}
      />

      {/* SLOT */}
      <h2>Slot Operation</h2>

      <input placeholder="Length (mm)" onChange={e => setSlot({ ...slot, length: e.target.value })} />
      <input placeholder="Width (mm)" onChange={e => setSlot({ ...slot, width: e.target.value })} />
      <input placeholder="Depth (mm)" onChange={e => setSlot({ ...slot, depth: e.target.value })} />
      <input type="number" value={slot.qty} onChange={e => setSlot({ ...slot, qty: e.target.value })} />

      <select value={slot.quality} onChange={e => setSlot({ ...slot, quality: e.target.value })}>
        <option value="high">High</option>
        <option value="balanced">Balanced</option>
        <option value="cost">Cost</option>
      </select>

      {/* HOLE */}
      <h2>Hole Operation</h2>

      <input placeholder="Diameter (mm)" onChange={e => setHole({ ...hole, diameter: e.target.value })} />
      <input placeholder="Depth (mm)" onChange={e => setHole({ ...hole, depth: e.target.value })} />
      <input type="number" value={hole.qty} onChange={e => setHole({ ...hole, qty: e.target.value })} />

      <select value={hole.quality} onChange={e => setHole({ ...hole, quality: e.target.value })}>
        <option value="high">High</option>
        <option value="balanced">Balanced</option>
        <option value="cost">Cost</option>
      </select>

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
      <input value={discount} onChange={e => setDiscount(e.target.value)} />

      <br /><br />

      <button onClick={handleCalculate}>Calculate</button>

      <pre>{result}</pre>
    </div>
  );
}