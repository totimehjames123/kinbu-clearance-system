import React from 'react'

function FormButton({title, handleSubmit, isDisabled, type}) {
  return (
    <button
      className={`my-5 p-4 ${isDisabled ? "bg-violet-300" : "bg-violet-900"} flex justify-center transition-all duration-300 ${!isDisabled && "hover:bg-indigo-700"} text-white rounded-lg w-full`}
      onClick={handleSubmit}
      disabled={isDisabled}
      type={type}
    >
      {title}
    </button>
  )
}

export default FormButton