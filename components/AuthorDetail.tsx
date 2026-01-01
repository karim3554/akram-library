
import React, { useState, useEffect } from 'react';
import { Author } from '../types';
import { getAuthorDetails, getAuthorPhotoUrl } from '../services/openLibrary';

interface AuthorDetailProps {
  authorId: string;
  onClose: () => void;
}

const AuthorDetail: React.FC<AuthorDetailProps> = ({ authorId, onClose }) => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await getAuthorDetails(authorId);
        setAuthor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [authorId]);

  if (loading) return (
    <div className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-serif italic">Reviewing the author's biography...</p>
      </div>
    </div>
  );

  if (!author) return null;

  const bio = typeof author.bio === 'string' ? author.bio : author.bio?.value || 'No biography available for this author.';

  return (
    <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 md:p-8 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 rounded-full transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-40 h-40 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden shadow-xl border-4 border-white">
              <img 
                src={getAuthorPhotoUrl(author.key.split('/').pop(), 'M')} 
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">{author.name}</h2>
              {author.birth_date && (
                <p className="text-indigo-600 font-medium mb-4 italic">
                  {author.birth_date} — {author.death_date || 'Present'}
                </p>
              )}
              {author.alternate_names && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {author.alternate_names.slice(0, 3).map(name => (
                    <span key={name} className="text-[10px] uppercase tracking-widest text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 prose prose-indigo max-w-none">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">About the Author</h3>
            <p className="text-gray-700 leading-relaxed text-lg font-light whitespace-pre-wrap">
              {bio}
            </p>
          </div>

          {author.links && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">External Links</h3>
              <div className="flex flex-wrap gap-4">
                {author.links.map(link => (
                  <a 
                    key={link.url} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetail;
