// FormSelectField.jsx

import React from 'react';

function FormSelectField({ title, className, onSelect, value, disabled, options }) {

    return (
        <div className={className}>
            <label htmlFor=''>{title}</label> <br />
            <select className='border p-4 rounded-lg mt-2 w-full' disabled={disabled} value={value} onChange={(e) => onSelect(e.target.value)}>
                <option value=''>Select {title}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
}

export default FormSelectField;
