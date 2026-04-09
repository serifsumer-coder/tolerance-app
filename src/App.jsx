import { useState } from "react";

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

  const [result, setResult] = useState("");

  const qualitySettings = {
    high: { feed: 2000 },
    balanced: { feed: 3000 },
    cost: { feed: 4500 }
  };

  const supplierRates = {
    A: 55,
    B: 45,
    C: 35
  };

  const calcTime = (L, W, D, feed) => {
    if (!L || !W || !D) return 0;
    const minutes = (L * W * D) / feed / 100;
    return minutes / 60;
  };

  const handleCalculate = () => {
    const feed = qualitySettings[quality].feed;
    const rate = supplierRates[supplier];

    const h1 = calcTime(length1, width1, depth1, feed);
    const h2 = calcTime(length2, width2, depth2, feed);

    const total1 = h1 * opQty1 * partQty;
    const total2 = h2 * opQty2 * partQty;

    const totalHours = total1 + total2;
    const machiningCost = totalHours * rate;

    let materialTotal = 0;

    if (includeMaterial && materialCost) {
      materialTotal = Number(materialCost) * partQty;
    }

    const finalCost = machiningCost + materialTotal;

    setResult(`
Workpieces: ${partQty}

Base Machining Cost: €${machiningCost.toFixed(0)}

Material Cost: €${materialTotal.toFixed(0)}

TOTAL COST: €${finalCost.toFixed(0)}
`);
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Manufacturing Estimator</h1>

      <h3>Workpiece Quantity</h3>
      <input
        type="number"
        value={partQty}
        onChange={(e) => setPartQty(Number(e.target.value))}
      />

      <h3>Operation 1</h3>
      <input placeholder="Length" onChange={e => setLength1(e.target.value)} /><br /><br />
      <input placeholder="Width" onChange={e => setWidth1(e.target.value)} /><br /><br />
      <input placeholder="Depth" onChange={e => setDepth1(e.target.value)} /><br /><br />
      <input placeholder="Feature Count" type="number" value={opQty1} onChange={e => setOpQty1(Number(e.target.value))} /><br /><br />

      <h3>Operation 2</h3>
      <input placeholder="Length" onChange={e => setLength2(e.target.value)} /><br /><br />
      <input placeholder="Width" onChange={e => setWidth2(e.target.value)} /><br /><br />
      <input placeholder="Depth" onChange={e => setDepth2(e.target.value)} /><br /><br />
      <input placeholder="Feature Count" type="number" value={opQty2} onChange={e => setOpQty2(Number(e.target.value))} /><br /><br />

      <h3>Quality</h3>
      <select onChange={e => setQuality(e.target.value)}>
        <option value="high">Premium</option>
        <option value="balanced">Balanced</option>
        <option value="cost">Cost</option>
      </select>

      <h3>Supplier</h3>
      <select onChange={e => setSupplier(e.target.value)}>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>

      <h3>Material</h3>
      <label>
        <input
          type="checkbox"
          checked={includeMaterial}
          onChange={(e) => setIncludeMaterial(e.target.checked)}
        />
        Include Material Cost
      </label>

      <br /><br />

      {includeMaterial && (
        <input
          placeholder="Material Cost per piece (€)"
          type="number"
          onChange={(e) => setMaterialCost(e.target.value)}
        />
      )}

      <br /><br />

      <button onClick={handleCalculate}>Calculate</button>

      <div style={{ whiteSpace: "pre-line", marginTop: 20 }}>
        {result}
      </div>
    </div>
  );
}