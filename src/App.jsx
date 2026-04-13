import { useState } from "react"

export default function App() {
  const [quantity, setQuantity] = useState(1)

  const [slots, setSlots] = useState([
    { length: "", width: "", depth: "", quality: "balanced" }
  ])

  const [holes, setHoles] = useState([
    { diameter: "", depth: "", quality: "balanced" }
  ])

  const [supplier, setSupplier] = useState("B")

  const [result, setResult] = useState(null)

  // 🔥 SLOT ENGINE (FIXED)
  const calculateSlotTime = (slot) => {
    const L = parseFloat(slot.length)
    const W = parseFloat(slot.width)
    const D = parseFloat(slot.depth)

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

    return timeMinutes / 60
  }

  // 🔵 HOLE ENGINE
  const calculateHoleTime = (hole) => {
    const dia = parseFloat(hole.diameter)
    const dep = parseFloat(hole.depth)

    if (!dia || !dep) return 0

    const feed = 3000

    const timeMinutes = (dep / feed) * 1000

    return timeMinutes / 60
  }

  const handleCalculate = () => {
    let slotTime = 0
    let holeTime = 0

    slots.forEach(s => {
      slotTime += calculateSlotTime(s)
    })

    holes.forEach(h => {
      holeTime += calculateHoleTime(h)
    })

    const totalTimePerPiece = slotTime + holeTime

    // 💰 COST MODEL
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

  return (
    <div style={{ padding: 40, fontFamily: "Arial", color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>Machining Estimator</h1>

      <h3>Workpiece Quantity</h3>
      <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />

      <h2>Slot Operations</h2>
      {slots.map((slot, i) => (
        <div key={i}>
          <input placeholder="Length" onChange={(e) => {
            const newSlots = [...slots]
            newSlots[i].length = e.target.value
            setSlots(newSlots)
          }} />
          <input placeholder="Width" onChange={(e) => {
            const newSlots = [...slots]
            newSlots[i].width = e.target.value
            setSlots(newSlots)
          }} />
          <input placeholder="Depth" onChange={(e) => {
            const newSlots = [...slots]
            newSlots[i].depth = e.target.value
            setSlots(newSlots)
          }} />

          <select onChange={(e) => {
            const newSlots = [...slots]
            newSlots[i].quality = e.target.value
            setSlots(newSlots)
          }}>
            <option value="high">High Quality</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      ))}

      <button onClick={() => setSlots([...slots, { length: "", width: "", depth: "", quality: "balanced" }])}>
        + Add Slot
      </button>

      <h2>Hole Operations</h2>
      {holes.map((hole, i) => (
        <div key={i}>
          <input placeholder="Diameter" onChange={(e) => {
            const newHoles = [...holes]
            newHoles[i].diameter = e.target.value
            setHoles(newHoles)
          }} />
          <input placeholder="Depth" onChange={(e) => {
            const newHoles = [...holes]
            newHoles[i].depth = e.target.value
            setHoles(newHoles)
          }} />
        </div>
      ))}

      <button onClick={() => setHoles([...holes, { diameter: "", depth: "", quality: "balanced" }])}>
        + Add Hole
      </button>

      <h3>Supplier</h3>
      <select onChange={(e) => setSupplier(e.target.value)}>
        <option value="A">A Tier</option>
        <option value="B">B Tier</option>
        <option value="C">C Tier</option>
      </select>

      <br /><br />
      <button onClick={handleCalculate}>Calculate</button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <p>Slot Time: {result.slotTime.toFixed(2)} h</p>
          <p>Hole Time: {result.holeTime.toFixed(2)} h</p>

          <h3>Time per piece: {result.totalTimePerPiece.toFixed(2)} h</h3>

          <p>Unit Cost: €{result.unitCost.toFixed(2)}</p>
          <h2>Total Cost: €{result.totalCost.toFixed(2)}</h2>
        </div>
      )}
    </div>
  )
}