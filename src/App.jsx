import { useState } from "react"

export default function App() {
  const [quantity, setQuantity] = useState(1)
  const [materialCost, setMaterialCost] = useState(0)

  const [slots, setSlots] = useState([
    { length: "", width: "", depth: "", count: 1, quality: "high" }
  ])

  const [holes, setHoles] = useState([
    { diameter: "", depth: "", count: 1, quality: "balanced" }
  ])

  const [supplier, setSupplier] = useState("B")
  const [result, setResult] = useState(null)

  // 🔥 SLOT ENGINE (FIXED QUALITY)
  const calculateSlotTime = (slot) => {
    const L = parseFloat(slot.length)
    const W = parseFloat(slot.width)
    const D = parseFloat(slot.depth)
    const count = parseFloat(slot.count) || 1

    if (!L || !W || !D) return 0

    const tool = 50
    const feed = 5500

    const efficiencyMap = {
      high: 0.08,       // ✅ doğru süre (Excel match)
      balanced: 0.10,   // faster
      fast: 0.12        // fastest
    }

    const efficiency = efficiencyMap[slot.quality]

    const volume = L * W * D
    const timeMinutes = volume / (feed * tool * efficiency)

    return (timeMinutes / 60) * count
  }

  // 🔵 HOLE ENGINE
  const calculateHoleTime = (hole) => {
    const dia = parseFloat(hole.diameter)
    const dep = parseFloat(hole.depth)
    const count = parseFloat(hole.count) || 1

    if (!dia || !dep) return 0

    const feed = 3000

    const base = (dep / feed) * 1000

    const factorMap = {
      high: 1.3,
      balanced: 1,
      fast: 0.8
    }

    return (base * factorMap[hole.quality] / 60) * count
  }

  const handleCalculate = () => {
    let slotTime = 0
    let holeTime = 0

    slots.forEach(s => slotTime += calculateSlotTime(s))
    holes.forEach(h => holeTime += calculateHoleTime(h))

    const totalTime = slotTime + holeTime

    const rateMap = {
      A: 55,
      B: 45,
      C: 35
    }

    const rate = rateMap[supplier]

    const unitCost = totalTime * rate + parseFloat(materialCost || 0)
    const totalCost = unitCost * quantity

    setResult({
      slotTime,
      holeTime,
      totalTime,
      unitCost,
      totalCost
    })
  }

  const format = (n) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(n)

  return (
    <div style={{ padding: 40, background: "#0f172a", color: "white", minHeight: "100vh" }}>
      <h1>Machining Estimator</h1>

      <h3>Workpiece Quantity</h3>
      <input value={quantity} onChange={e => setQuantity(e.target.value)} />

      <h3>Material Cost (€ / piece)</h3>
      <input value={materialCost} onChange={e => setMaterialCost(e.target.value)} />

      <h2>Slot Operations</h2>
      {slots.map((s, i) => (
        <div key={i}>
          <input placeholder="Length" onChange={e => { let x=[...slots]; x[i].length=e.target.value; setSlots(x)}} />
          <input placeholder="Width" onChange={e => { let x=[...slots]; x[i].width=e.target.value; setSlots(x)}} />
          <input placeholder="Depth" onChange={e => { let x=[...slots]; x[i].depth=e.target.value; setSlots(x)}} />
          <input placeholder="Qty" onChange={e => { let x=[...slots]; x[i].count=e.target.value; setSlots(x)}} />

          <select onChange={e => { let x=[...slots]; x[i].quality=e.target.value; setSlots(x)}}>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>

          <div style={{ fontSize: 12 }}>
            {s.quality === "high" && "High Quality (Precise / Slow)"}
            {s.quality === "balanced" && "Balanced (Optimal)"}
            {s.quality === "fast" && "Fast (Cost Efficient)"}
          </div>
        </div>
      ))}
      <button onClick={() => setSlots([...slots, { length:"", width:"", depth:"", count:1, quality:"high"}])}>+ Add Slot</button>

      <h2>Hole Operations</h2>
      {holes.map((h, i) => (
        <div key={i}>
          <input placeholder="Diameter" onChange={e => { let x=[...holes]; x[i].diameter=e.target.value; setHoles(x)}} />
          <input placeholder="Depth" onChange={e => { let x=[...holes]; x[i].depth=e.target.value; setHoles(x)}} />
          <input placeholder="Qty" onChange={e => { let x=[...holes]; x[i].count=e.target.value; setHoles(x)}} />

          <select onChange={e => { let x=[...holes]; x[i].quality=e.target.value; setHoles(x)}} >
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>

          <div style={{ fontSize: 12 }}>
            {h.quality === "high" && "High Quality (Precise)"}
            {h.quality === "balanced" && "Balanced"}
            {h.quality === "fast" && "Fast"}
          </div>
        </div>
      ))}
      <button onClick={() => setHoles([...holes, { diameter:"", depth:"", count:1, quality:"balanced"}])}>+ Add Hole</button>

      <h3>Supplier Selection</h3>
      <select onChange={e => setSupplier(e.target.value)}>
        <option value="A">A Tier - 55 €/h</option>
        <option value="B">B Tier - 45 €/h</option>
        <option value="C">C Tier - 35 €/h</option>
      </select>

      <br /><br />
      <button onClick={handleCalculate}>Calculate</button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <p>Slot Time: {format(result.slotTime)} h</p>
          <p>Hole Time: {format(result.holeTime)} h</p>

          <h3>Time per piece: {format(result.totalTime)} h</h3>

          <p>Unit Cost: €{format(result.unitCost)}</p>
          <h2>Total Cost: €{format(result.totalCost)}</h2>
        </div>
      )}
    </div>
  )
}