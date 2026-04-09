import { useState } from "react";

export default function App() {
  const [length1, setLength1] = useState("");
  const [width1, setWidth1] = useState("");
  const [depth1, setDepth1] = useState("");

  const [length2, setLength2] = useState("");
  const [width2, setWidth2] = useState("");
  const [depth2, setDepth2] = useState("");

  const [quality, setQuality] = useState("balanced");
  const [supplier, setSupplier] = useState("B");

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

    const totalHours = h1 + h2;
    const totalCost = totalHours * rate;

    setResult(`
Operation 1: ${h1.toFixed(2)} h
Operation 2: ${h2.toFixed(2)} h

TOTAL TIME: ${totalHours.toFixed(2)} h
TOTAL COST: €${totalCost.toFixed(0)}
`);
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Multi Operation Estimator</h1>

      <h3>Operation 1</h3>
      <input placeholder="Length" onChange={e => setLength1(e.target.value)} /><br /><br />
      <input placeholder="Width" onChange={e => setWidth1(e.target.value)} /><br /><br />
      <input placeholder="Depth" onChange={e => setDepth1(e.target.value)} /><br /><br />

      <h3>Operation 2</h3>
      <input placeholder="Length" onChange={e => setLength2(e.target.value)} /><br /><br />
      <input placeholder="Width" onChange={e => setWidth2(e.target.value)} /><br /><br />
      <input placeholder="Depth" onChange={e => setDepth2(e.target.value)} /><br /><br />

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

      <br /><br />

      <button onClick={handleCalculate}>Calculate Total</button>

      <div style={{ whiteSpace: "pre-line", marginTop: 20 }}>
        {result}
      </div>
    </div>
  );
}