import React from 'react'

function SmallCard({value, title, color}) {
  return (
    <div className={`rounded-lg px-2 bg-${color}-100 border border-${color}-300 p-1 items-center flex gap-2`}>
        <button className={`bg-${color}-200 text-${color}-500 rounded-full w-7 h-7 text-xs`}>{value}</button>
        <p className={`text-${color}-500 text-xs`}>{title}</p>
    </div>
  )
}

export default SmallCard