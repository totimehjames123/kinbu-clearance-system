import React from 'react';
import { BsSliders } from 'react-icons/bs';
import Select from 'react-select';
import { departmentOptions } from '../utils/constant'; // Adjust path as needed

const FilterComponent = ({ filters, onChange }) => {
  return (
    <div className="flex flex-wrap mt-2 gap-1">
      <div className='pt-[0.7px]'>
        <BsSliders className='w-9 h-9 p-2 bg-black rounded-lg text-white'/>
      </div>

      {filters.map((filter) => (
        <div key={filter.id} className="w-full md:w-auto mb-4">
          <label className="mb-1 sm:hidden block">{filter.label}</label>
          <Select
            placeholder={filter.label}
            options={filter.options}
            value={filter.value}
            onChange={(selectedOption) => onChange(filter.id, selectedOption)}
            isMulti={filter.isMulti}
            isClearable={true}
            closeMenuOnSelect={!filter.isMulti}
            className="w-full"
            styles={{
              control: (provided) => ({
                ...provided,
                borderRadius: '0.375rem',
                borderColor: '#e2e8f0',
                '&:hover': {
                  borderColor: '#cbd5e0',
                },
              }),
              singleValue: (provided) => ({
                ...provided,
                color: '#4a5568',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#4a90e2' : 'white',
                color: state.isSelected ? 'white' : '#1a202c',
                borderRadius: '0.25rem',
                '&:hover': {
                  backgroundColor: '#cbd5e0',
                  color: '#1a202c',
                },
              }),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FilterComponent;
