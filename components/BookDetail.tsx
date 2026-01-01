
import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { getBookDetails, getCoverUrl } from '../services/openLibrary';
import { getBookRecommendation, getBookSummary } from '../services/geminiService';
import { OPEN_LIBRARY_API } from '../constants';
import AuthorDetail from './AuthorDetail';

interface BookDetailProps {
  bookKey: string;
  onClose: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ bookKey, onClose }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getBookDetails(bookKey);
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [bookKey]);

  const handleAIHelp = async () => {
    if (!book) return;
    setAiLoading(true);
    try {
      const author = typeof book.author_name === 'string' ? book.author_name : (book.author_name?.[0] || 'Unknown');
      const [recs, summary] = await Promise.all([
        getBookRecommendation(book.title, author),
        getBookSummary(book.title, typeof book.description === 'string' ? book.description : (book.description as any)?.value || 'No description available')
      ]);
      setRecommendations(recs);
      setAiSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-serif italic">Unrolling the ancient manuscripts...</p>
      </div>
    </div>
  );

  if (!book) return null;

  const descriptionText = typeof book.description === 'string' 
    ? book.description 
    : (book.description as any)?.value || 'No detailed description available for this work in the archives.';

  const coverUrl = book.cover_i 
    ? getCoverUrl(book.cover_i, 'id', 'L') 
    : (book as any).cover_edition_key 
      ? getCoverUrl((book as any).cover_edition_key, 'olid', 'L')
      : book.isbn?.[0]
        ? getCoverUrl(book.isbn[0], 'isbn', 'L')
        : getCoverUrl(undefined);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-300">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 rounded-full transition-all z-10 group"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0">
            {/* Left Column: Image and Meta */}
            <div className="md:col-span-4 bg-gray-50 p-8 md:p-12 flex flex-col items-center border-r border-gray-100">
              <div className="w-full max-w-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden mb-8 transform -rotate-1 hover:rotate-0 transition-transform duration-700">
                <img 
                  src={coverUrl} 
                  alt={book.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="w-full space-y-3">
                <div className="flex justify-between text-xs py-2.5 border-b border-gray-200 uppercase tracking-widest font-bold text-gray-400">
                  <span>Published</span>
                  <span className="text-gray-900">{book.first_publish_year || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs py-2.5 border-b border-gray-200 uppercase tracking-widest font-bold text-gray-400">
                  <span>Median Pages</span>
                  <span className="text-gray-900">{book.number_of_pages_median || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs py-2.5 border-b border-gray-200 uppercase tracking-widest font-bold text-gray-400">
                  <span>Language</span>
                  <span className="text-gray-900 uppercase">{(book as any).languages?.[0]?.key?.split('/').pop() || 'EN'}</span>
                </div>
                
                <button 
                  onClick={handleAIHelp}
                  disabled={aiLoading}
                  className="w-full mt-6 py-4 bg-indigo-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-800 transition-all shadow-xl hover:shadow-indigo-200 disabled:opacity-50 active:scale-95"
                >
                  {aiLoading ? (
                    <span className="animate-pulse">Consulting the Oracle...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Insights
                    </>
                  )}
                </button>

                <a 
                  href={`${OPEN_LIBRARY_API}${book.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-3 py-3 border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Open Library Profile
                </a>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="md:col-span-8 p-8 md:p-16">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4">
                {book.title}
              </h1>
              <div className="flex items-center gap-2 mb-10 group">
                <span className="text-gray-400 italic font-serif text-lg">A work by</span>
                <button 
                  onClick={() => book.author_key?.[0] && setSelectedAuthorId(book.author_key[0])}
                  className="text-xl text-indigo-600 font-medium italic font-serif hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 transition-colors"
                >
                  {book.author_name?.[0] || 'Unknown Author'}
                </button>
              </div>

              <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-black mb-2">The Narrative</h3>
                <p className="whitespace-pre-line text-lg font-light leading-relaxed">{descriptionText}</p>
              </div>

              {/* AI Insights Section */}
              {(recommendations || aiSummary) && (
                <div className="mt-12 p-8 bg-indigo-50 rounded-3xl border border-indigo-100 animate-in fade-in slide-in-from-top-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-[#c878a0] rounded-full flex items-center justify-center shadow-md transform rotate-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-indigo-950">Akram's Oracle</h3>
                      <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Librarian Insights</p>
                    </div>
                  </div>
                  
                  {aiSummary && (
                    <div className="mb-10">
                      <h4 className="text-xs font-black uppercase text-indigo-300 tracking-[0.2em] mb-4">Essence of the Work</h4>
                      <div className="text-indigo-900 text-sm leading-relaxed space-y-3 prose prose-sm max-w-none">
                        {aiSummary.split('\n').filter(l => l.trim()).map((line, i) => (
                          <p key={i} className="flex gap-2">
                            <span className="text-indigo-400">•</span>
                            {line.replace(/^[*-]\s*/, '')}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendations && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-indigo-300 tracking-[0.2em] mb-4">Further Discovery</h4>
                      <div className="text-indigo-900 text-sm leading-relaxed space-y-2 whitespace-pre-wrap italic">
                        {recommendations}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-5">Categorization</h3>
                <div className="flex flex-wrap gap-2">
                  {book.subject?.slice(0, 10).map(subject => (
                    <span key={subject} className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-[11px] font-bold border border-gray-200 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-default">
                      {subject}
                    </span>
                  )) || <span className="text-gray-400 italic text-sm">General Collection</span>}
                </div>
              </div>
              
              <p className="mt-12 text-[10px] text-gray-400 text-center italic">
                Courtesy of <a href="https://openlibrary.org" target="_blank" rel="noreferrer" className="underline hover:text-indigo-500">Open Library</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedAuthorId && (
        <AuthorDetail 
          authorId={selectedAuthorId} 
          onClose={() => setSelectedAuthorId(null)} 
        />
      )}
    </>
  );
};

export default BookDetail;
