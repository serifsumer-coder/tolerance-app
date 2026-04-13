import { useState } from "react"

export default function App() {
  const [quantity, setQuantity] = useState(1)

  const [slots, setSlots] = useState([
    { length: "", width: "", depth: "", count: 1, quality: "balanced" }
  ])

  const [holes, setHoles] = useState([
    { diameter: "", depth: "", count: 1, quality: "balanced" }
  ])

  const [supplier, setSupplier] = useState("B")
  const [result, setResult] = useState(null)

  // 🔥 SLOT ENGINE
  const calculateSlotTime = (slot) => {
    const L = parseFloat(slot.length)
    const W = parseFloat(slot.width)
    const D = parseFloat(slot.depth)
    const count = parseFloat(slot.count) || 1

    if (!L || !W || !D) return 0

    const tool = 50
    const feed = 5500

    const efficiencyMap = {
      high: 0.06,
      balanced: 0.08,
      fast: 0.1
    }

    const efficiency = efficiencyMap[slot.quality] || 0.08

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

    const baseTime = (dep / feed) * 1000

    const qualityFactor = {
      high: 1.3,
      balanced: 1,
      fast: 0.8
    }

    const factor = qualityFactor[hole.quality] || 1

    return (baseTime * factor / 60) * count
  }

  const handleCalculate = () => {
    let slotTime = 0
    let holeTime = 0

    slots.forEach(s => slotTime += calculateSlotTime(s))
    holes.forEach(h => holeTime += calculateHoleTime(h))

    const totalTimePerPiece = slotTime + holeTime

    const hourlyRateMap = {
      A: 120,
      B: 90,
      C: 60
    }

    const rate = hourlyRateMap[supplier]

    const unitCost = totalTimePerPiece * rate
    const totalCost = unitCost * quantity

    setResult({
      slotTime,
      holeTime,
      totalTimePerPiece,
      unitCost,
      totalCost
    })
  }

  const format = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial", color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>Machining Estimator</h1>

      <h3>Workpiece Quantity</h3>
      <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />

      <h2>Slot Operations</h2>
      {slots.map((slot, i) => (
        <div key={i}>
          <input placeholder="Length" onChange={(e) => {
            const s = [...slots]; s[i].length = e.target.value; setSlots(s)
          }} />
          <input placeholder="Width" onChange={(e) => {
            const s = [...slots]; s[i].width = e.target.value; setSlots(s)
          }} />
          <input placeholder="Depth" onChange={(e) => {
            const s = [...slots]; s[i].depth = e.target.value; setSlots(s)
          }} />
          <input placeholder="Qty" onChange={(e) => {
            const s = [...slots]; s[i].count = e.target.value; setSlots(s)
          }} />

          <select onChange={(e) => {
            const s = [...slots]; s[i].quality = e.target.value; setSlots(s)
          }}>
            <option value="high">High Quality</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>

          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {slot.quality === "high" && "High Quality (Slow / Precise)"}
            {slot.quality === "balanced" && "Balanced (Optimal)"}
            {slot.quality === "fast" && "Fast (Cost Efficient)"}
          </div>
        </div>
      ))}

      <button onClick={() => setSlots([...slots, { length: "", width: "", depth: "", count: 1, quality: "balanced" }])}>
        + Add Slot
      </button>

      <h2>Hole Operations</h2>
      {holes.map((hole, i) => (
        <div key={i}>
          <input placeholder="Diameter" onChange={(e) => {
            const h = [...holes]; h[i].diameter = e.target.value; setHoles(h)
          }} />
          <input placeholder="Depth" onChange={(e) => {
            const h = [...holes]; h[i].depth = e.target.value; setHoles(h)
          }} />
          <input placeholder="Qty" onChange={(e) => {
            const h = [...holes]; h[i].count = e.target.value; setHoles(h)
          }} />

          <select onChange={(e) => {
            const h = [...holes]; h[i].quality = e.target.value; setHoles(h)
          }}>
            <option value="high">High Quality</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>

          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {hole.quality === "high" && "High Quality (Slow / Precise)"}
            {hole.quality === "balanced" && "Balanced (Optimal)"}
            {hole.quality === "fast" && "Fast (Cost Efficient)"}
          </div>
        </div>
      ))}

      <button onClick={() => setHoles([...holes, { diameter: "", depth: "", count: 1, quality: "balanced" }])}>
        + Add Hole
      </button>

      <h3>Supplier</h3>
      <select onChange={(e) => setSupplier(e.target.value)}>
        <option value="A">A Tier</option>
        <option value="B">B Tier</option>
        <option value="C">C Tier</option>
      </select>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        {supplier === "A" && "High-end precision supplier"}
        {supplier === "B" && "Balanced industrial supplier"}
        {supplier === "C" && "Cost-focused supplier"}
      </div>

      <br /><br />
      <button onClick={handleCalculate}>Calculate</button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <p>Slot Time: {format(result.slotTime)} h</p>
          <p>Hole Time: {format(result.holeTime)} h</p>

          <h3>Time per piece: {format(result.totalTimePerPiece)} h</h3>

          <p>Unit Cost: €{format(result.unitCost)}</p>
          <h2>Total Cost: €{format(result.totalCost)}</h2>
        </div>
      )}
    </div>
  )
}