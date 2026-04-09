import { useState } from "react";

export default function App() {
  // TOLERANCE STATE
  const [nominal, setNominal] = useState("");
  const [tol, setTol] = useState("");
  const [actual, setActual] = useState("");
  const [tolResult, setTolResult] = useState("");

  // MACHINING STATE
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [quality, setQuality] = useState("balanced");
  const [machResult, setMachResult] = useState("");

  const qualitySettings = {
    high: { feed: 2000, rpm: 8000, label: "🟢 Premium Finish (Rz ~3 μm)" },
    balanced: { feed: 3000, rpm: 7000, label: "🟡 Balanced (Rz ~10 μm)" },
    cost: { feed: 4500, rpm: 5500, label: "🔴 Cost Optimized (Rz ~25 μm)" }
  };

  // TOLERANCE LOGIC
  const handleTolerance = () => {
    const n = Number(nominal);
    const t = Number(tol);
    const a = Number(actual);

    if (!n || !t || !a) {
      setTolResult("❗ Fill all fields");
      return;
    }

    const min = n - t;
    const max = n + t;

    if (a >= min && a <= max) {
      if (t < n * 0.01) {
        setTolResult("⚠️ Within tolerance but very tight → high cost risk");
      } else {
        setTolResult("✅ Within tolerance → OK");
      }
    } else {
      setTolResult("❌ Out of tolerance → reject or rework needed");
    }
  };

  // MACHINING LOGIC
  const handleMachining = () => {
    const L = Number(length);
    const W = Number(width);
    const D = Number(depth);

    if (!L || !W || !D) {
      setMachResult("❗ Fill all fields");
      return;
    }

    const { feed, rpm, label } = qualitySettings[quality];

    const minutes = (L * W * D) / feed / 100;
    const hours = minutes / 60;

    setMachResult(
      `${label}

⏱ Time: ${hours.toFixed(2)} h
⚙️ Feed: ${feed} mm/min
🔄 RPM: ${rpm}`
    );
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Manufacturing Decision Tool</h1>

      {/* TOLERANCE BLOCK */}
      <h2>Tolerance Check</h2>

      <input
        placeholder="Nominal"
        value={nominal}
        onChange={(e) => setNominal(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Tolerance (±)"
        value={tol}
        onChange={(e) => setTol(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Actual"
        value={actual}
        onChange={(e) => setActual(e.target.value)}
      />
      <br /><br />

      <button onClick={handleTolerance}>Check Tolerance</button>

      <div style={{ margin: "20px", whiteSpace: "pre-line" }}>
        {tolResult}
      </div>

      <hr />

      {/* MACHINING BLOCK */}
      <h2>Machining Estimator</h2>

      <input
        placeholder="Length (mm)"
        value={length}
        onChange={(e) => setLength(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Width (mm)"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Depth (mm)"
        value={depth}
        onChange={(e) => setDepth(e.target.value)}
      />
      <br /><br />

      <select value={quality} onChange={(e) => setQuality(e.target.value)}>
        <option value="high">🟢 Premium</option>
        <option value="balanced">🟡 Balanced</option>
        <option value="cost">🔴 Cost</option>
      </select>

      <br /><br />

      <button onClick={handleMachining}>Calculate</button>

      <div style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
        {machResult}
      </div>
    </div>
  );
}