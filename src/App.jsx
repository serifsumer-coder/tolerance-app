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

  // 🔧 SLOT ENGINE
  const calculateSlotTime = (s) => {
    const L = Number(s.length)
    const W = Number(s.width)
    const D = Number(s.depth)
    const count = Number(s.count) || 1

    if (!L || !W || !D) return 0

    const tool = 50
    const feed = 5500

    const map = {
      high: 0.08,
      balanced: 0.10,
      fast: 0.12
    }

    const volume = L * W * D
    const minutes = volume / (feed * tool * map[s.quality])

    return (minutes / 60) * count
  }

  // 🔥 FINAL HOLE ENGINE (EXCEL MATCH)
  const calculateHoleTime = (h) => {

    const depth = Number(h.depth)
    const count = Number(h.count) || 1

    if (!depth) return 0

    const config = {
      high:   { peck:10, cut:25, retract:5, air:2 },
      balanced:{ peck:15, cut:12, retract:3, air:1 },
      fast:   { peck:20, cut:8,  retract:2, air:0.5 }
    }

    const c = config[h.quality]

    // 🔧 minimum 1 peck
    const peckCount = Math.max(1, Math.ceil(depth / c.peck))

    const perPeck = c.cut + c.retract + c.air

    let totalSeconds =
      (peckCount * perPeck)
      + 18 // setup (0.3 min)

    // 🔥 safety margin
    totalSeconds *= 1.15

    const hours = totalSeconds / 3600

    return hours * count
  }

  const handleCalculate = () => {

    let slotTime = 0
    let holeTime = 0

    slots.forEach(s => slotTime += calculateSlotTime(s))
    holes.forEach(h => holeTime += calculateHoleTime(h))

    const totalTime = slotTime + holeTime

    // 🔥 GUARANTEED RATE
    const rateMap = {
      A: 55,
      B: 45,
      C: 35
    }

    const rate = rateMap[String(supplier)]

    const machiningCost = totalTime * rate

    const unitCost =
      machiningCost + Number(materialCost || 0)

    const totalCost = unitCost * Number(quantity || 1)

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
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n)

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
        </div>
      ))}

      <button onClick={()=>setHoles([...holes,{diameter:"",depth:"",count:1,quality:"high"}])}>
        + Add Hole
      </button>

      <h3 style={{marginTop:30}}>Supplier Selection</h3>

      <div style={{fontSize:12}}>
        ● A Tier Precision &nbsp;
        ● B Tier Industrial &nbsp;
        ● C Tier Cost
      </div>

      <select value={supplier} onChange={e=>setSupplier(e.target.value)}>
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

          <p>Total Time: {f(result.totalTime)} h</p>

          <p>Machining Cost: €{f(result.machiningCost)}</p>
          <p>Material Cost: €{f(materialCost)}</p>

          <h3>Unit Cost: €{f(result.unitCost)}</h3>
          <h2>Total Cost: €{f(result.totalCost)}</h2>
        </div>
      )}
    </div>
  )
}