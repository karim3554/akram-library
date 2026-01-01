
import React from 'react';

interface LegalModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const LegalModal: React.FC<LegalModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[150] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-gray-900 uppercase tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8 overflow-y-auto font-serif text-gray-700 leading-relaxed text-sm space-y-4">
          {children}
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-right">
          <button 
            onClick={onClose}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
