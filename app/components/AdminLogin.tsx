import { useState } from 'react';
import { Admin } from '../types/auth';

interface AdminLoginProps {
  onLogin: (credentials: Admin) => void;
  onClose: () => void;
  isRegisterMode?: boolean;
}

const inputStyles = "w-full p-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-150 bg-white text-black placeholder-gray-400";
const buttonStyles = "w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-full font-medium shadow-lg transform transition-all duration-150 active:scale-95";

export function AdminLogin({ onLogin, onClose, isRegisterMode }: AdminLoginProps) {
  const [credentials, setCredentials] = useState<Admin>({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            {isRegisterMode ? 'Înregistrare Admin' : 'Login Admin'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Nume utilizator
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Parolă
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className={inputStyles}
              required
            />
          </div>

          <button
            type="submit"
            className={buttonStyles}
          >
            {isRegisterMode ? 'Înregistrare' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
} 