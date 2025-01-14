import React from 'react';

interface AdminListProps {
  onClose: () => void;
}

export const AdminList: React.FC<AdminListProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Admin List</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {/* Add your admin list content here */}
          <p className="text-gray-600">No admins found.</p>
        </div>
      </div>
    </div>
  );
}; 