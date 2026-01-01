
import React from 'react';

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          onClick={() => onSearch('Fiction')} 
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-[#c878a0] rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-gray-900">akram _library</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <button onClick={() => onSearch('Classic')} className="hover:text-black transition-colors">Classics</button>
          <button onClick={() => onSearch('History')} className="hover:text-black transition-colors">History</button>
          <button onClick={() => onSearch('Science')} className="hover:text-black transition-colors">Science</button>
          <div className="h-4 w-px bg-gray-200" />
          <button className="text-black">Catalogue</button>
        </div>

        <button className="md:hidden p-2 text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
