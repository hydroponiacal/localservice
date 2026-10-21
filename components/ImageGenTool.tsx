import React, { useState } from 'react';
import { generateServiceImage } from '../services/gemini';
import { ImageSize } from '../types';

const ImageGenTool: React.FC = () => {
  const [prompt, setPrompt] = useState('a friendly local plumber repairing a kitchen sink in a classic Boston brownstone');
  const [size, setSize] = useState<ImageSize>(ImageSize.K1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generateServiceImage(prompt, size);
      if (url) {
        setImageUrl(url);
      } else {
        setError("Unable to generate image at this time. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Couldn't generate the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200 mt-12">
      <div className="flex items-center gap-3 mb-6">
        <i className="fa-solid fa-wand-magic-sparkles text-red-600 text-2xl"></i>
        <h2 className="text-2xl font-bold">Visual Inspiration</h2>
      </div>
      <p className="text-stone-600 mb-6">Want to see what your project could look like? Let our neighborly AI paint a picture.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Describe what you want to see</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 rounded-xl border border-stone-200 focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 outline-none transition-all duration-300 resize-none h-32 shadow-sm focus:shadow-blue-500/10"
              placeholder="E.g., A cozy backyard garden with professional landscaping..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Image Quality (Resolution)</label>
            <div className="flex gap-2">
              {[ImageSize.K1, ImageSize.K2, ImageSize.K4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                    size === s 
                      ? 'bg-stone-800 text-white border-stone-800' 
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner animate-spin"></i> Sketching...</>
            ) : (
              <><i className="fa-solid fa-palette"></i> Generate Image</>
            )}
          </button>
          
          {error && <p className="text-red-500 text-sm italic">{error}</p>}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex items-center justify-center min-h-[300px] shadow-inner">
          {imageUrl ? (
            <img src={imageUrl} alt="Generated inspiration" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <i className="fa-solid fa-image text-4xl text-stone-200 mb-4"></i>
              <p className="text-stone-400">Your generated vision will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenTool;
