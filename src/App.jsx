import { useState, useEffect } from "react";

export default function App() {
  const [partQty, setPartQty] = useState(1);

  const [length1, setLength1] = useState("");
  const [width1, setWidth1] = useState("");
  const [depth1, setDepth1] = useState("");
  const [opQty1, setOpQty1] = useState(1);

  const [length2, setLength2] = useState("");
  const [width2, setWidth2] = useState("");
  const [depth2, setDepth2] = useState("");
  const [opQty2, setOpQty2] = useState(1);

  const [quality, setQuality] = useState("balanced");
  const [supplier, setSupplier] = useState("B");

  const [includeMaterial, setIncludeMaterial] = useState(false);
  const [materialCost, setMaterialCost] = useState("");

  const [discount, setDiscount] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const [result, setResult] = useState("");

  const qualitySettings = {
    high: { feed: 2000, desc: "Best surface (Rz ~3 μm), slower but precise" },
    balanced: { feed: 3000, desc: "Good surface (Rz ~10 μm), balanced" },
    cost: { feed: 4500, desc: "Rough (Rz ~25 μm), fastest & cheapest" }
  };

  const supplierRates = {
    A: { rate: 55, desc: "High-end supplier, EU pricing" },
    B: { rate: 45, desc: "Balanced supplier, best value" },
    C: { rate: 35, desc: "Low cost, small workshops" }
  };

  const calcTime = (L, W, D, feed) => {
    if (!L || !W || !D) return 0;
    return (L * W * D) / feed / 100 / 60;
  };

  const getSuggestion = (qty) => {
    if (qty >= 200) return { label: "Full Serial", range: "20–35%" };
    if (qty >= 50) return { label: "Mid Serial", range: "10–20%" };
    if (qty >= 10) return { label: "Mini Serial", range: "5–10%" };
    return { label: "Low Volume", range: "-" };
  };

  // 🔥 AUTO SUGGESTION
  useEffect(() => {
    const s = getSuggestion(partQty);
    setSuggestion(`${s.label} → ${s.range}`);
  }, [partQty]);

  const handleCalculate = () => {
    const feed = qualitySettings[quality].feed;
    const rate = supplierRates[supplier].rate;

    const h1 = calcTime(length1, width1, depth1, feed);
    const h2 = calcTime(length2, width2, depth2, feed);

    const totalHours = (h1 * opQty1 + h2 * opQty2) * partQty;
    const machiningCost = totalHours * rate;

    let materialTotal = 0;
    if (includeMaterial && materialCost) {
      materialTotal = Number(materialCost) * partQty;
    }

    const subtotal = machiningCost + materialTotal;

    const d = Number(discount) || 0;
    const finalCost = subtotal * (1 - d / 100);

    const perPiece = finalCost / partQty;

    setResult(`
Workpieces: ${partQty}

Base Machining Cost: €${machiningCost.toLocaleString()}
Material Cost: €${materialTotal.toLocaleString()}

Subtotal: €${subtotal.toLocaleString()}

Applied Discount: -${d}%

--------------------------------

Cost per Piece: €${perPiece.toFixed(2)}

Grand Total (${partQty} pcs): €${finalCost.toLocaleString()}
`);
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Manufacturing Estimator</h1>

      <h3>Workpiece Quantity</h3>
      <input type="number" value={partQty} onChange={e => setPartQty(Number(e.target.value))} />

      <h3>Operation 1</h3>
      <input placeholder="Length" onChange={e => setLength1(e.target.value)} /><br /><br />
      <input placeholder="Width" onChange={e => setWidth1(e.target.value)} /><br /><br />
      <input placeholder="Depth" onChange={e => setDepth1(e.target.value)} /><br /><br />
      <input type="number" value={opQty1} onChange={e => setOpQty1(Number(e.target.value))} /><br /><br />

      <h3>Operation 2</h3>
      <input placeholder="Length" onChange={e => setLength2(e.target.value)} /><br /><br />
      <input placeholder="Width" onChange={e => setWidth2(e.target.value)} /><br /><br />
      <input placeholder="Depth" onChange={e => setDepth2(e.target.value)} /><br /><br />
      <input type="number" value={opQty2} onChange={e => setOpQty2(Number(e.target.value))} /><br /><br />

      <h3>Quality</h3>
      <select value={quality} onChange={e => setQuality(e.target.value)}>
        <option value="high">Premium</option>
        <option value="balanced">Balanced</option>
        <option value="cost">Cost</option>
      </select>
      <div style={{ fontSize: 14 }}>{qualitySettings[quality].desc}</div>

      <h3>Supplier</h3>
      <select value={supplier} onChange={e => setSupplier(e.target.value)}>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <div style={{ fontSize: 14 }}>{supplierRates[supplier].desc}</div>

      <h3>Material</h3>
      <label>
        <input type="checkbox" checked={includeMaterial} onChange={e => setIncludeMaterial(e.target.checked)} />
        Include Material
      </label>

      <br /><br />

      {includeMaterial && (
        <input
          type="number"
          placeholder="Material Cost per piece (€)"
          style={{ width: "260px" }}
          onChange={e => setMaterialCost(e.target.value)}
        />
      )}

      <h3>Discount (%)</h3>
      <input
        type="number"
        placeholder={suggestion}
        value={discount}
        onChange={e => setDiscount(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCalculate}>Calculate</button>

      <div style={{ whiteSpace: "pre-line", marginTop: 20 }}>
        {result}
      </div>
    </div>
  );
}