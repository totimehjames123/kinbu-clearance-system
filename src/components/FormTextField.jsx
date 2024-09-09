import React from 'react'

function FormTextField({label, type, placeholder, id, value, required, setText, toggleShowPassword, toggleShowPasswordText, className, disabled}) {
  return (
    <div className={className}>
        <div className='flex justify-between text-gray-500'>
          
          {id === "password" || "currentPassword" || "newPassword" ? 
            <>
              <label htmlFor={id}>{label}</label>
              <button onClick={() => toggleShowPassword()} className='text-xs font-bold hover:underline text-green-500'>{toggleShowPasswordText}</button>
            </>
          : 
            <>
              <label htmlFor={id}>{label}</label>
            </>}
        </div>
        
        <input
            type={type}
            className='border p-4 rounded-lg mt-1 w-full'
            placeholder={placeholder}
            value={value}
            id={id}
            onChange={(e) => setText(e.target.value)}
            required={required}
            disabled={disabled}
        />
    </div>
  )
}

export default FormTextField