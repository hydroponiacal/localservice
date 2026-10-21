
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ServiceShowcase from './components/ServiceShowcase';
import ImageGenTool from './components/ImageGenTool';
import ChatBot from './components/ChatBot';
import { getTrendingServices } from './services/gemini';

const App: React.FC = () => {
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {},
        (error) => {
          setLocationError("To find the absolute closest neighbors, we'd love to see your general area! But don't worry, we'll use Boston center for now.");
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />

      <main className="container mx-auto px-4 mt-8 flex-grow">
        {/* Promotion Banner */}
        <div className="bg-stone-800 text-white rounded-3xl p-8 mb-12 shadow-xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-2xl">
              <div className="bg-red-600 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full inline-block mb-4">Limited Early Access</div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">First 10 Customers Get a <span className="text-red-500 italic underline decoration-white">Lifetime Subscription</span></h2>
              <p className="text-stone-300 text-lg mb-6">
                We're building the future of Boston's local services. Join us early and lock in neighborly pricing forever—currently at <span className="font-bold text-white">50% off</span> while we finalize our full launch details.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg transform hover:-translate-y-1">
                  Claim Lifetime Access
                </button>
                <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 font-medium transition-colors">
                  Learn about our pricing journey <i className="fa-solid fa-arrow-right text-sm"></i>
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-48 h-48 rounded-full border-4 border-dashed border-stone-600 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-32 h-32 rounded-full bg-red-600/20 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                   <i className="fa-solid fa-award text-5xl text-red-500"></i>
                </div>
              </div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </div>

        {locationError && (
          <div className="mb-8 p-4 bg-stone-100 border-l-4 border-stone-400 text-stone-600 text-sm italic rounded-r-lg">
             <i className="fa-solid fa-circle-info mr-2"></i> {locationError}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Main Content: Local Directory */}
          <div className="xl:col-span-2 space-y-12">
            <ServiceShowcase />
            <ImageGenTool />
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-arrow-trend-up text-red-600"></i>
                2026 Home Trends
              </h3>
              <TrendingWidget />
            </div>

            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Need Help Now?</h3>
              <p className="text-blue-700 mb-6 text-sm leading-relaxed">
                Our local network is always growing. If you can't find who you're looking for, <a href="#" className="text-blue-600 font-bold hover:underline">chat with Mo</a> or check out our <a href="#" className="text-blue-600 font-bold hover:underline">recent community forums</a>.
              </p>
              <button className="w-full bg-white text-blue-900 border-2 border-blue-900/20 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                Report a Service Issue
              </button>
            </div>
            
            <div className="p-8 border-2 border-dashed border-stone-200 rounded-3xl">
               <h4 className="font-bold text-stone-700 mb-2">Our Neighbors in Boston</h4>
               <p className="text-stone-500 text-sm">Serving Somerville, Cambridge, Quincy, Brookline, and all neighborhoods within 20 miles.</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 pt-12 border-t border-stone-200 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-600 text-white p-1 rounded">
                <i className="fa-solid fa-house-chimney text-xs"></i>
              </div>
              <span className="font-bold text-xl">MyLocalServices.online</span>
            </div>
            <p className="text-stone-500 max-w-sm">
              Connecting Boston homeowners with the very best local professionals. No corporate fluff, just good work by good people.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4">Explore</h5>
            <ul className="space-y-2 text-stone-600 text-sm">
              <li><a href="#" className="text-blue-600 hover:underline">Find a Plumber</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Find an Electrician</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">HVAC Specialists</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Local Reviews</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Company</h5>
            <ul className="space-y-2 text-stone-600 text-sm">
              <li><a href="#" className="text-blue-600 hover:underline">Our Story</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Terms of Service</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="bg-stone-50 py-6 border-t border-stone-100">
          <div className="container mx-auto px-4 text-center text-stone-400 text-xs">
            &copy; 2026 MyLocalServices.online. Proudly serving the Greater Boston Community.
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

const TrendingWidget: React.FC = () => {
  const [trends, setTrends] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        // Use the getTrendingServices function from the centralized service
        const result = await getTrendingServices();
        setTrends(result.text);
        setSources(result.sources);
      } catch (e) {
        setTrends("Smart home upgrades, heat pump conversions, and drought-resistant landscaping are leading the way this year.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  if (loading) return <div className="space-y-2"><div className="h-4 bg-stone-100 animate-pulse rounded w-full"></div><div className="h-4 bg-stone-100 animate-pulse rounded w-5/6"></div></div>;

  return (
    <div className="space-y-6">
      <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
        {trends}
      </div>
      {sources.length > 0 && (
        <div className="pt-4 border-t border-stone-100">
           <p className="text-[10px] text-stone-400 uppercase font-bold mb-3 tracking-widest">Neighborly Citations</p>
           <div className="space-y-2">
             {sources.slice(0, 3).map((s, i) => (
               <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline truncate">
                 <i className="fa-solid fa-link mr-1 opacity-50"></i> {s.title}
               </a>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
