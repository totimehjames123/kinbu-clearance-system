import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onDeleteConfirm, fullName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-xl mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete <span className='font-bold'>{fullName}</span>?</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={onDeleteConfirm} className="bg-red-500 text-white p-2 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
