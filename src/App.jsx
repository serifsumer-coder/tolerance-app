import { useState } from "react"

export default function App() {

  const [quantity, setQuantity] = useState(1)
  const [materialCost, setMaterialCost] = useState(0)

  const [slots, setSlots] = useState([
    { length: "", width: "", depth: "", count: 1, quality: "high" }
  ])

  const [holes, setHoles] = useState([
    { diameter: "", depth: "", count: 1, quality: "high" }
  ])

  const [supplier, setSupplier] = useState(55)

  const [result, setResult] = useState(null)

  // ================= SLOT (FINAL FIX) =================

  const calculateSlotTime = (s) => {
    const length = +s.length
    const depth = +s.depth
    const count = +s.count || 1

    if (!length || !depth) return 0

    // 🔥 DOĞRU MODEL (width kaldırıldı, scale düzeltildi)
    const baseTime = (length * depth) / 1200

    const multipliers = {
      high: 1,
      balanced: 0.8,
      fast: 0.6
    }

    return baseTime * multipliers[s.quality] * count
  }

  // ================= HOLE =================

  const calculateHoleTime = (h) => {

    const depth = +h.depth
    const count = +h.count || 1

    if (!depth) return 0

    const config = {
      high:   { peck:10, cut:25, retract:5, air:2 },
      balanced:{ peck:15, cut:12, retract:3, air:1 },
      fast:   { peck:20, cut:8,  retract:2, air:0.5 }
    }

    const c = config[h.quality]

    const peckCount = Math.ceil(depth / c.peck)
    const perPeck = c.cut + c.retract + c.air

    const cuttingSeconds = peckCount * perPeck * count

    const setupSeconds = 30

    const totalSeconds = (cuttingSeconds * 1.15) + setupSeconds

    return totalSeconds / 3600
  }

  // ================= CALCULATE =================

  const handleCalculate = () => {

    const slotTime = slots.reduce((acc, s) => acc + calculateSlotTime(s), 0)
    const holeTime = holes.reduce((acc, h) => acc + calculateHoleTime(h), 0)

    const totalTime = slotTime + holeTime

    const machiningCost = totalTime * supplier

    const unitCost = machiningCost + Number(materialCost || 0)

    const totalCost = unitCost * quantity

    setResult({
      slotTime,
      holeTime,
      totalTime,
      machiningCost,
      materialCost,
      unitCost,
      totalCost
    })
  }

  // ================= UI =================

  return (
    <div style={{ textAlign: "center", padding: 40, color: "white", background: "#0b1a2b", minHeight: "100vh" }}>

      <h1>Machining Estimator</h1>

      <h3>Workpiece Quantity</h3>
      <input value={quantity} onChange={e => setQuantity(e.target.value)} />

      <h3 style={{ marginTop: 30 }}>Material Cost (€ / piece)</h3>
      <input value={materialCost} onChange={e => setMaterialCost(e.target.value)} />

      <h2 style={{ marginTop: 40 }}>Slot Operations</h2>

      {slots.map((s, i) => (
        <div key={i}>
          <input placeholder="Length" onChange={e => {
            const newSlots = [...slots]
            newSlots[i].length = e.target.value
            setSlots(newSlots)
          }} />
          <input placeholder="Width" onChange={e => {
            const newSlots = [...slots]
            newSlots[i].width = e.target.value
            setSlots(newSlots)
          }} />
          <input placeholder="Depth" onChange={e => {
            const newSlots = [...slots]
            newSlots[i].depth = e.target.value
            setSlots(newSlots)
          }} />
          <input value={s.count} onChange={e => {
            const newSlots = [...slots]
            newSlots[i].count = e.target.value
            setSlots(newSlots)
          }} />

          <select onChange={e => {
            const newSlots = [...slots]
            newSlots[i].quality = e.target.value
            setSlots(newSlots)
          }}>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>

          <div>
            {s.quality === "high" && "High Quality (Precise / Slow)"}
            {s.quality === "balanced" && "Balanced"}
            {s.quality === "fast" && "Fast"}
          </div>

        </div>
      ))}

      <button onClick={() => setSlots([...slots, { length:"", width:"", depth:"", count:1, quality:"high"}])}>
        + Add Slot
      </button>

      <h2 style={{ marginTop: 40 }}>Hole Operations</h2>

      {holes.map((h, i) => (
        <div key={i}>
          <input placeholder="Diameter" onChange={e => {
            const newHoles = [...holes]
            newHoles[i].diameter = e.target.value
            setHoles(newHoles)
          }} />
          <input placeholder="Depth" onChange={e => {
            const newHoles = [...holes]
            newHoles[i].depth = e.target.value
            setHoles(newHoles)
          }} />
          <input value={h.count} onChange={e => {
            const newHoles = [...holes]
            newHoles[i].count = e.target.value
            setHoles(newHoles)
          }} />

          <select onChange={e => {
            const newHoles = [...holes]
            newHoles[i].quality = e.target.value
            setHoles(newHoles)
          }}>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>

          <div>
            {h.quality === "high" && "High Quality (Peck drilling slow)"}
            {h.quality === "balanced" && "Balanced drilling"}
            {h.quality === "fast" && "Fast drilling"}
          </div>

        </div>
      ))}

      <button onClick={() => setHoles([...holes, { diameter:"", depth:"", count:1, quality:"high"}])}>
        + Add Hole
      </button>

      <h2 style={{ marginTop: 40 }}>Supplier Selection</h2>

      <div style={{ marginBottom: 10 }}>
        • A Tier Precision • B Tier Industrial • C Tier Cost
      </div>

      <select onChange={e => setSupplier(Number(e.target.value))}>
        <option value={55}>A Tier - 55 €/h</option>
        <option value={45}>B Tier - 45 €/h</option>
        <option value={35}>C Tier - 35 €/h</option>
      </select>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleCalculate}>Calculate</button>
      </div>

      {result && (
        <div style={{ marginTop: 40 }}>
          <h2>========= SUMMARY =========</h2>

          <div>Slot Time: {result.slotTime.toFixed(2)} h</div>
          <div>Hole Time: {result.holeTime.toFixed(2)} h</div>
          <div>Total Time: {result.totalTime.toFixed(2)} h</div>

          <div>Machining Cost: €{result.machiningCost.toFixed(2)}</div>
          <div>Material Cost: €{Number(result.materialCost).toFixed(2)}</div>

          <h3>Unit Cost: €{result.unitCost.toFixed(2)}</h3>
          <h2>Total Cost: €{result.totalCost.toFixed(2)}</h2>
        </div>
      )}

    </div>
  )
}