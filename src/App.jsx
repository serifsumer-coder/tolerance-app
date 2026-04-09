import { useState } from "react";

export default function App() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [quality, setQuality] = useState("balanced");
  const [result, setResult] = useState("");

  const qualitySettings = {
    high: {
      feed: 2000,
      rpm: 8000,
      label: "🟢 Premium Finish (Rz ~3 μm)"
    },
    balanced: {
      feed: 3000,
      rpm: 7000,
      label: "🟡 Balanced (Rz ~10 μm)"
    },
    cost: {
      feed: 4500,
      rpm: 5500,
      label: "🔴 Cost Optimized (Rz ~25 μm)"
    }
  };

  const handleCheck = () => {
    const L = Number(length);
    const W = Number(width);
    const D = Number(depth);

    if (!L || !W || !D) {
      setResult("❗ Please fill all fields");
      return;
    }

    const { feed, rpm, label } = qualitySettings[quality];

    // Basit ama mantıklı model (şimdilik)
    const minutes = (L * W * D) / feed / 100;
    const hours = minutes / 60;

    setResult(
      `${label}

⏱ Time: ${hours.toFixed(2)} h
⚙️ Feed: ${feed} mm/min
🔄 RPM: ${rpm}`
    );
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Machining Estimator</h1>

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

      <select
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
      >
        <option value="high">🟢 Premium</option>
        <option value="balanced">🟡 Balanced</option>
        <option value="cost">🔴 Cost</option>
      </select>

      <br /><br />

      <button onClick={handleCheck}>Calculate</button>

      <div style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
        {result}
      </div>
    </div>
  );
}