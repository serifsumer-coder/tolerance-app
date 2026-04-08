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

    const ratio = t / n;

    let costMessage = "";

    if (ratio < 0.01) {
      costMessage = "💸 Cost impact: HIGH";
    } else if (ratio < 0.03) {
      costMessage = "💰 Cost impact: MEDIUM";
    } else {
      costMessage = "💲 Cost impact: LOW";
    }

    if (a >= min && a <= max) {
      if (t < n * 0.01) {
        setResult(
          "⚠️ Tolerance is very tight (<1%)\nLikely increases machining cost\nConsider relaxing if function allows\n\n" +
            costMessage
        );
      } else {
        setResult("✅ Within tolerance → OK\n\n" + costMessage);
      }
    } else {
      setResult(
        "❌ Out of tolerance → reject or rework needed\n\n" +
          costMessage
      );
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Tolerance Check Tool</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Nominal (e.g. 100)"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Tolerance (e.g. 0.5)"
          value={tolerance}
          onChange={(e) => setTolerance(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Actual (e.g. 100.2)"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
        />
      </div>

      <button onClick={handleCheck}>Check</button>

      <div style={{ marginTop: "20px", whiteSpace: "pre-line" }}>
        {result}
      </div>
    </div>
  );
}

export default App;