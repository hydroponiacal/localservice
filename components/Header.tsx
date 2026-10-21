
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-stone-200 py-6 sticky top-0 z-40">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-2 rounded-lg">
            <i className="fa-solid fa-house-chimney text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">MyLocalServices.online</h1>
            <p className="text-stone-500 text-sm italic">Neighbors helping neighbors in Boston</p>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Directory</a>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">How it Works</a>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 shadow-md">
            Find Service
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
