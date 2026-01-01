
import React, { useState, useEffect, useCallback } from 'react';
import { Book } from './types';
import { searchBooks } from './services/openLibrary';
import { CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import BookDetail from './components/BookDetail';
import AILibrarian from './components/AILibrarian';
import LegalModal from './components/LegalModal';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookKey, setSelectedBookKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState('');
  const [numFound, setNumFound] = useState(0);

  // Legal Modal State
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);

  const performSearch = useCallback(async (searchQuery: string, pageNum: number = 1, append: boolean = false, currentSort: string = '') => {
    const q = searchQuery.trim() || 'Fiction';
    
    setLoading(true);
    setError(null);
    try {
      const result = await searchBooks(q, pageNum, currentSort);
      setNumFound(result.numFound);
      
      if (append) {
        setBooks(prev => [...prev, ...result.docs]);
      } else {
        setBooks(result.docs);
        setPage(1);
      }
      setHasMore(result.docs.length >= 20);
    } catch (err) {
      setError('The archive is currently inaccessible. Please try again soon.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch('Fiction', 1, false, sort);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, 1, false, sort);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(query || 'Fiction', nextPage, true, sort);
  };

  const handleCategoryClick = (category: string) => {
    setQuery(category);
    performSearch(category, 1, false, sort);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    performSearch(query || 'Fiction', 1, false, newSort);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onSearch={(q) => { setQuery(q); performSearch(q, 1, false, sort); }} />

      {/* Hero / Minimal Search Section */}
      <section className="bg-white border-b border-gray-100 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
              The Library
            </h1>
            <p className="text-lg md:text-xl font-serif italic text-gray-500 mb-10 max-w-2xl">
              "A comprehensive collection of world literature, preserved in digital form."
            </p>
            
            <form onSubmit={handleSearchSubmit} className="relative group max-w-2xl">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a work by author or title..."
                className="w-full pl-0 pr-4 py-4 bg-transparent border-b-2 border-gray-200 text-gray-900 placeholder-gray-300 focus:border-black focus:outline-none transition-all text-xl font-serif italic"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        
        {/* Categories Bar */}
        <div className="mb-12 overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 pb-4 border-b border-gray-50">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  query.toLowerCase() === cat.toLowerCase() 
                    ? 'text-black border-b border-black pb-4 -mb-4.5' 
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 gap-4">
          <div className="flex items-baseline gap-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
              {query ? `Catalogue: ${query}` : 'General Collection'}
            </h2>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
              {(numFound || 0).toLocaleString()} Volumes
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort by:</span>
            <select 
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-gray-900 border-none outline-none cursor-pointer focus:ring-0"
            >
              <option value="">Relevance</option>
              <option value="new">Newest</option>
              <option value="old">Classical</option>
            </select>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16">
          {books.map((book) => (
            <BookCard 
              key={book.key} 
              book={book} 
              onClick={(b) => setSelectedBookKey(b.key)} 
            />
          ))}
          
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-4">
              <div className="bg-gray-50 aspect-[2/3] w-full"></div>
              <div className="h-4 bg-gray-50 w-3/4"></div>
              <div className="h-3 bg-gray-50 w-1/4"></div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && !loading && books.length > 0 && (
          <div className="mt-24 text-center">
            <button 
              onClick={loadMore}
              className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all border-b-2 border-transparent hover:border-black pb-2"
            >
              Browse more works
            </button>
          </div>
        )}
      </main>

      {/* Simplified Footer with Legal Links */}
      <footer className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#c878a0] rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold">akram _library</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
              A repository of human thought, digitized for the modern seeker. Built upon the vast archives of Open Library.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 mb-6">Archive</h4>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <li><a href="https://openlibrary.org" target="_blank" rel="noreferrer" className="hover:text-black">Open Library</a></li>
                <li><a href="https://archive.org" target="_blank" rel="noreferrer" className="hover:text-black">Internet Archive</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 mb-6">Legal</h4>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <li><button onClick={() => setActiveLegalModal('privacy')} className="hover:text-black">Privacy Policy</button></li>
                <li><button onClick={() => setActiveLegalModal('disclaimer')} className="hover:text-black">Disclaimer</button></li>
                <li><button onClick={() => setActiveLegalModal('dmca')} className="hover:text-black">DMCA</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 mb-6">Catalogue</h4>
              <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <li><button onClick={() => setActiveLegalModal('copyright')} className="hover:text-black">Copyright</button></li>
                <li><a href="#" className="hover:text-black">Metadata</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-gray-50 flex justify-between items-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-300 font-bold">
            © {new Date().getFullYear()} akram _library. All knowledge is shared.
          </p>
          <div className="flex gap-6 items-center opacity-20 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-serif italic">LOA Style Guide 2024</span>
          </div>
        </div>
      </footer>

      {/* Book Detail Modal */}
      {selectedBookKey && (
        <BookDetail 
          bookKey={selectedBookKey} 
          onClose={() => setSelectedBookKey(null)} 
        />
      )}

      {/* Legal Modals */}
      <LegalModal 
        title="Privacy Policy" 
        isOpen={activeLegalModal === 'privacy'} 
        onClose={() => setActiveLegalModal(null)}
      >
        <p><strong>Overview:</strong> akram _library respects your privacy and is committed to protecting the integrity of your personal browsing habits within our digital library.</p>
        <p><strong>Data Collection:</strong> We do not require account registration. No personal identifying information (PII) is stored on our servers. Search queries are processed in real-time to provide bibliographic results from the Open Library API.</p>
        <p><strong>AI Processing:</strong> Literary recommendations and summaries are generated using the Google Gemini API. While your specific queries are sent to Google for processing, they are not linked to a personal akram _library profile.</p>
        <p><strong>Cookies:</strong> We use minimal local storage to remember your search preferences and current session data. We do not use third-party tracking cookies for advertising.</p>
        <p><strong>Third Parties:</strong> Links to Open Library, Internet Archive, and Google Maps are subject to their respective privacy policies.</p>
      </LegalModal>

      <LegalModal 
        title="Disclaimer" 
        isOpen={activeLegalModal === 'disclaimer'} 
        onClose={() => setActiveLegalModal(null)}
      >
        <p><strong>Bibliographic Accuracy:</strong> The metadata, summaries, and cover images presented on akram _library are retrieved from the Open Library API. We cannot guarantee the absolute accuracy or completeness of this external data.</p>
        <p><strong>AI Content:</strong> "Akram's Oracle" and all AI-generated insights are powered by large language models. These insights are intended for experimental and literary purposes and may occasionally contain inaccuracies or hallucinations. Please verify critical information with primary sources.</p>
        <p><strong>Academic Nature:</strong> This application is a curated digital gateway designed for academic exploration. It does not provide medical, legal, or professional advice.</p>
        <p><strong>External Links:</strong> We are not responsible for the content or availability of external websites linked within our records.</p>
      </LegalModal>

      <LegalModal 
        title="DMCA & Intellectual Property" 
        isOpen={activeLegalModal === 'dmca'} 
        onClose={() => setActiveLegalModal(null)}
      >
        <p><strong>Source Attribution:</strong> akram _library is a metadata interface that displays information and covers provided by the <strong>Open Library</strong> and <strong>Internet Archive</strong>. We do not host the physical book files on our infrastructure.</p>
        <p><strong>Copyright Policy:</strong> We respect the intellectual property rights of authors and publishers. If you believe your copyrighted work is being accessed through akram _library in a way that constitutes infringement, please submit a formal notification.</p>
        <p><strong>Notice Procedure:</strong> As we serve content directly from Open Library, we strongly recommend that DMCA notices also be directed to <em>info@archive.org</em> for primary removal from the source archives. However, you may contact our administrators to request the masking of specific metadata within the akram _library interface.</p>
        <p><strong>Fair Use:</strong> Summaries and cover thumbnails are used for transformative, educational, and bibliographic identification purposes under the principles of Fair Use.</p>
      </LegalModal>

      <LegalModal 
        title="Copyright Notice" 
        isOpen={activeLegalModal === 'copyright'} 
        onClose={() => setActiveLegalModal(null)}
      >
        <p><strong>App Copyright:</strong> © {new Date().getFullYear()} akram _library. All code and curated UI design are the property of the project administrators.</p>
        <p><strong>Literary Works:</strong> Copyright for all book titles, descriptions, and cover art remains with the respective authors, estates, or publishers. akram _library provides access to these records for bibliographic discovery.</p>
        <p><strong>Data Credits:</strong> Bibliographic metadata is sourced from the <a href="https://openlibrary.org" target="_blank" rel="noreferrer" className="underline">Open Library</a>, a project of the Internet Archive, under various open licenses (CC0, etc.).</p>
        <p><strong>Academic Use:</strong> Users are encouraged to cite the source archives when referencing the data found through this portal.</p>
      </LegalModal>

      <AILibrarian />
    </div>
  );
};

export default App;
