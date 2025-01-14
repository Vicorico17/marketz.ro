import { useState, useRef } from 'react';
import { GameFormData } from '../types/game';

interface CreateGameFormProps {
  onSubmit: (data: GameFormData) => void;
}

export function CreateGameForm({ onSubmit }: CreateGameFormProps) {
  const [formData, setFormData] = useState<GameFormData>({
    player1: '',
    player2: '',
    time: '',
  });
  const [previewUrls, setPreviewUrls] = useState<{
    player1?: string;
    player2?: string;
  }>({});

  const handleImageUpload = (player: 'player1' | 'player2', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({
        ...prev,
        [`${player}Image`]: base64String
      }));
      setPreviewUrls(prev => ({
        ...prev,
        [player]: base64String
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ player1: '', player2: '', time: '' });
    setPreviewUrls({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
      <div className="grid grid-cols-2 gap-6">
        {/* Player 1 Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jucător 1</label>
            <input
              type="text"
              value={formData.player1}
              onChange={(e) => setFormData({ ...formData, player1: e.target.value })}
              className="w-full p-2 border rounded bg-white text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Poză Jucător 1</label>
            <div className="flex flex-col items-center space-y-2">
              {previewUrls.player1 && (
                <img
                  src={previewUrls.player1}
                  alt="Preview Player 1"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload('player1', e.target.files[0])}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Player 2 Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jucător 2</label>
            <input
              type="text"
              value={formData.player2}
              onChange={(e) => setFormData({ ...formData, player2: e.target.value })}
              className="w-full p-2 border rounded bg-white text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Poză Jucător 2</label>
            <div className="flex flex-col items-center space-y-2">
              {previewUrls.player2 && (
                <img
                  src={previewUrls.player2}
                  alt="Preview Player 2"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload('player2', e.target.files[0])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Timp</label>
        <input
          type="datetime-local"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full p-2 border rounded bg-white text-black"
          required
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-3 px-10 rounded-full font-semibold text-base shadow-lg transition-all duration-150 hover:scale-105 active:scale-95"
        >
          Creează Meci Nou
        </button>
      </div>
    </form>
  );
} 