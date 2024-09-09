function FormTitle({title, description, className}) {
    return (
      <div>
          <h3 className={`text-4xl text font-bold text-center`}>{title}</h3>
          <p className={`${className} text-gray-900`}>{description}</p>
      </div>
    )
  }
  
  export default FormTitle