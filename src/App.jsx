import { useState } from "react";

function App() {
  const [nominal, setNominal] = useState("");
  const [tolerance, setTolerance] = useState("");
  const [actual, setActual] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = () => {
  const n = parseFloat(nominal);
  const t = parseFloat(tolerance);
  const a = parseFloat(actual);

  if (isNaN(n) || isNaN(t) || isNaN(a)) {
    setResult("⚠️ Please enter all values");
    return;
  }

  const min = n - t;
  const max = n + t;

  if (a >= min && a <= max) {
    if (t < n * 0.01) {
      setResult("⚠️ Within tolerance but very tight → high cost risk");
    } else {
      setResult("✅ Within tolerance → OK");
    }
  } else {
    setResult("❌ Out of tolerance → reject or rework needed");
  }
};

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Tolerance Check Tool</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Nominal"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Tolerance (±)"
          value={tolerance}
          onChange={(e) => setTolerance(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Actual value"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
        />
      </div>

      <button onClick={handleCheck}>Check</button>

      <h2 style={{ marginTop: "20px" }}>{result}</h2>
    </div>
  );
}

export default App;