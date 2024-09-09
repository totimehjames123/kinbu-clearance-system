import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'

function SearchField({setSearchTerm, placeholder}) {
  return (
    <div className='bg-white rounded-lg overflow-hidden max-h-10 border flex items-center'>
          <button className='rounded-tl-lg rounded-bl-lg cursor-default p-3 text-center bg-violet-500'>
            <FaMagnifyingGlass className='text-white mr-1'/>
          </button>
          <input placeholder={placeholder} onChange={(e) => setSearchTerm(e.target.value)} className='bg-white px-2 focus:outline-none'/>
    </div>
  )
}

export default SearchField