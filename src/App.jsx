import { useState } from "react"

export default function App() {

  const [quantity, setQuantity] = useState(1)
  const [materialCost, setMaterialCost] = useState(0)

  const [slots, setSlots] = useState([
    { length:"", width:"", depth:"", count:1, quality:"high" }
  ])

  const [holes, setHoles] = useState([
    { diameter:"", depth:"", count:1, quality:"high" }
  ])

  const [supplier, setSupplier] = useState("B")
  const [result, setResult] = useState(null)

  // 🔥 SLOT (DOĞRU MODELİN KORUNDU)
  const calculateSlotTime = (s) => {
    const L = +s.length
    const W = +s.width
    const D = +s.depth
    const count = +s.count || 1

    if (!L || !W || !D) return 0

    const tool = 50
    const feed = 5500

    const map = {
      high: 0.08,
      balanced: 0.10,
      fast: 0.12
    }

    const volume = L * W * D

    const min = volume / (feed * tool * map[s.quality])

    return (min / 60) * count
  }

  // 🔥🔥🔥 YENİ HOLE ENGINE (EXCEL MODELİ)
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

    let totalSeconds =
      (peckCount * perPeck)
      + (0.3 * 60) // setup

    // 🔥 %15 safety margin
    totalSeconds *= 1.15

    const minutes = totalSeconds / 60

    return (minutes / 60) * count
  }

  const handleCalculate = () => {

    let slotTime = 0
    let holeTime = 0

    slots.forEach(s => slotTime += calculateSlotTime(s))
    holes.forEach(h => holeTime += calculateHoleTime(h))

    const totalTime = slotTime + holeTime

    const rateMap = {
      A:55,
      B:45,
      C:35
    }

    const rate = rateMap[supplier]

    const machiningCost = totalTime * rate

    const unitCost =
      machiningCost + (+materialCost || 0)

    const totalCost = unitCost * quantity

    setResult({
      slotTime,
      holeTime,
      totalTime,
      machiningCost,
      unitCost,
      totalCost
    })
  }

  const f = (n) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits:2 }).format(n)

  return (
    <div style={{padding:40, background:"#0f172a", color:"white", minHeight:"100vh"}}>

      <h1>Machining Estimator</h1>

      <h3>Workpiece Quantity</h3>
      <input value={quantity} onChange={e=>setQuantity(e.target.value)} />

      <h3 style={{marginTop:20}}>Material Cost (€ / piece)</h3>
      <input value={materialCost} onChange={e=>setMaterialCost(e.target.value)} />

      <h2 style={{marginTop:40}}>Slot Operations</h2>

      {slots.map((s,i)=>(
        <div key={i}>
          <input placeholder="Length" onChange={e=>{let x=[...slots]; x[i].length=e.target.value; setSlots(x)}} />
          <input placeholder="Width" onChange={e=>{let x=[...slots]; x[i].width=e.target.value; setSlots(x)}} />
          <input placeholder="Depth" onChange={e=>{let x=[...slots]; x[i].depth=e.target.value; setSlots(x)}} />
          <input placeholder="Qty" onChange={e=>{let x=[...slots]; x[i].count=e.target.value; setSlots(x)}} />

          <select onChange={e=>{let x=[...slots]; x[i].quality=e.target.value; setSlots(x)}}>
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>

          <div style={{fontSize:12}}>
            {s.quality==="high" && "High Quality (Precise / Slow)"}
            {s.quality==="balanced" && "Balanced (Optimal)"}
            {s.quality==="fast" && "Fast (Cost Efficient)"}
          </div>
        </div>
      ))}

      <button onClick={()=>setSlots([...slots,{length:"",width:"",depth:"",count:1,quality:"high"}])}>
        + Add Slot
      </button>

      <h2>Hole Operations</h2>

      {holes.map((h,i)=>(
        <div key={i}>
          <input placeholder="Diameter" onChange={e=>{let x=[...holes]; x[i].diameter=e.target.value; setHoles(x)}} />
          <input placeholder="Depth" onChange={e=>{let x=[...holes]; x[i].depth=e.target.value; setHoles(x)}} />
          <input placeholder="Qty" onChange={e=>{let x=[...holes]; x[i].count=e.target.value; setHoles(x)}} />

          <select onChange={e=>{let x=[...holes]; x[i].quality=e.target.value; setHoles(x)}} >
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast</option>
          </select>

          <div style={{fontSize:12}}>
            {h.quality==="high" && "High Quality (Peck drilling slow)"}
            {h.quality==="balanced" && "Balanced drilling"}
            {h.quality==="fast" && "Fast drilling"}
          </div>
        </div>
      ))}

      <button onClick={()=>setHoles([...holes,{diameter:"",depth:"",count:1,quality:"high"}])}>
        + Add Hole
      </button>

      <h3 style={{marginTop:30}}>Supplier Selection</h3>

      <div style={{fontSize:12}}>
        <span style={{color:"#4ade80"}}>●</span> A Tier Precision &nbsp;
        <span style={{color:"#60a5fa"}}>●</span> B Tier Industrial &nbsp;
        <span style={{color:"#f87171"}}>●</span> C Tier Cost
      </div>

      <select onChange={e=>setSupplier(e.target.value)}>
        <option value="A">A Tier - 55 €/h</option>
        <option value="B">B Tier - 45 €/h</option>
        <option value="C">C Tier - 35 €/h</option>
      </select>

      <br/><br/>
      <button onClick={handleCalculate}>Calculate</button>

      {result && (
        <div style={{marginTop:40}}>
          <h3>======== SUMMARY ========</h3>

          <p>Slot Time: {f(result.slotTime)} h</p>
          <p>Hole Time: {f(result.holeTime)} h</p>

          <p>Total Machining Time: {f(result.totalTime)} h</p>

          <p>Machining Cost: €{f(result.machiningCost)}</p>
          <p>Material Cost: €{f(materialCost)}</p>

          <h3>Unit Cost: €{f(result.unitCost)}</h3>
          <h2>Total Cost: €{f(result.totalCost)}</h2>
        </div>
      )}

    </div>
  )
}