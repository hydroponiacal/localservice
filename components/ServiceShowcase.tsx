
import React, { useState, useEffect } from 'react';
import { getTopServiceProviders } from '../services/gemini';
import { GroundingSource } from '../types';

const ServiceShowcase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [category, setCategory] = useState('Plumbers');

  const categories = ['Plumbers', 'Electricians', 'HVAC Technicians', 'Landscapers', 'House Cleaners'];

  const fetchData = async (cat: string) => {
    setLoading(true);
    try {
      // Use the centralized gemini service instead of re-implementing locally
      const result = await getTopServiceProviders(cat);
      setContent(result.text);
      setSources(result.sources);
    } catch (err) {
      console.error(err);
      setContent("Oops! We couldn't load the local recommendations right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(category);
  }, [category]);

  return (
    <section className="py-12 bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="px-8 mb-8">
        <h2 className="text-3xl font-bold mb-4 text-stone-900">Trusted Local Pros</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat 
                ? 'bg-red-600 text-white shadow-md' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-stone-500 italic">Asking around the neighborhood for the best {category}...</p>
          </div>
        ) : (
          <div className="prose prose-stone max-w-none">
            <div className="whitespace-pre-wrap text-stone-700 leading-relaxed mb-8 font-light text-lg">
              {content}
            </div>
            
            {sources.length > 0 && (
              <div className="mt-8 pt-8 border-t border-stone-100">
                <h4 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">Verified via Google Maps</h4>
                <div className="flex flex-wrap gap-4">
                  {sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    >
                      <i className="fa-solid fa-location-dot"></i>
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceShowcase;
