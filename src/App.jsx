import { useState, useEffect } from "react";

export default function App() {
  const [partQty, setPartQty] = useState(1);

  const [holes, setHoles] = useState([
    { diameter: "", depth: "", qty: 1, type: "drilling" }
  ]);

  const [quality, setQuality] = useState("balanced");
  const [supplier, setSupplier] = useState("B");

  const [discount, setDiscount] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const [result, setResult] = useState("");

  const supplierRates = {
    A: 55,
    B: 45,
    C: 35
  };

  const qualityFactor = {
    high: 0.8,
    balanced: 1,
    cost: 1.5
  };

  const holeBase = {
    drilling: 120,
    deep: 60
  };

  const getSuggestion = (qty) => {
    if (qty >= 200) return "20–35%";
    if (qty >= 50) return "10–20%";
    if (qty >= 10) return "5–10%";
    return "-";
  };

  useEffect(() => {
    setSuggestion(getSuggestion(partQty));
  }, [partQty]);

  const addHole = () => {
    setHoles([...holes, { diameter: "", depth: "", qty: 1, type: "drilling" }]);
  };

  const updateHole = (index, field, value) => {
    const newHoles = [...holes];
    newHoles[index][field] = value;
    setHoles(newHoles);
  };

  const calcHoleTime = (h) => {
    if (!h.diameter || !h.depth) return 0;

    const base = holeBase[h.type];
    const qFactor = qualityFactor[quality];

    return (h.diameter * h.depth * h.qty) / (base * qFactor) / 60;
  };

  const handleCalculate = () => {
    const rate = supplierRates[supplier];

    let totalHours = 0;

    holes.forEach(h => {
      totalHours += calcHoleTime(h);
    });

    totalHours *= partQty;

    const machiningCost = totalHours * rate;

    const d = Number(discount) || 0;
    const finalCost = machiningCost * (1 - d / 100);

    const perPiece = finalCost / partQty;

    setResult(`
Workpieces: ${partQty}

Total Time: ${totalHours.toFixed(2)} h

Base Machining Cost: €${machiningCost.toLocaleString()}

Applied Discount: -${d}%

--------------------------------

Cost per Piece: €${perPiece.toFixed(2)}

Grand Total (${partQty} pcs): €${finalCost.toLocaleString()}
`);
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Hole Engine</h1>

      <h3>Workpiece Quantity</h3>
      <input type="number" value={partQty} onChange={e => setPartQty(Number(e.target.value))} />

      <h3>Holes</h3>

      {holes.map((h, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <input placeholder="Diameter" onChange={e => updateHole(i, "diameter", e.target.value)} />
          <input placeholder="Depth" onChange={e => updateHole(i, "depth", e.target.value)} />
          <input type="number" value={h.qty} onChange={e => updateHole(i, "qty", e.target.value)} />

          <select onChange={e => updateHole(i, "type", e.target.value)}>
            <option value="drilling">Drilling</option>
            <option value="deep">Deep Drilling</option>
          </select>
        </div>
      ))}

      <button onClick={addHole}>+ Add Hole</button>

      <h3>Quality</h3>
      <select onChange={e => setQuality(e.target.value)}>
        <option value="high">High</option>
        <option value="balanced">Balanced</option>
        <option value="cost">Cost</option>
      </select>

      <h3>Supplier</h3>
      <select onChange={e => setSupplier(e.target.value)}>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>

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